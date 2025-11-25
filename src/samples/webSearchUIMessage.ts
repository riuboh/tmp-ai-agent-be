import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { createUIMessageStream, streamText, tool, type UIMessage } from 'ai';

export type MyUIMessage = UIMessage<
  unknown, // 第1引数: Metadata（使用しない場合は unknown）
  {
    hello: string; // 第2引数: Data Parts
    goodbye: string;
  }
>;

// UIメッセージストリームを作成（お試し）
const stream = createUIMessageStream<MyUIMessage>({
  execute: async ({ writer }) => {
    const result = streamText({
      model: openai.responses('gpt-5-mini'),
      providerOptions: {
        openai: {
          store: false,
          reasoningEffort: 'low',
        },
      },
      tools: {
        web_search: openai.tools.webSearch({
          filters: { allowedDomains: ['jobcatalog.yahoo.co.jp'] },
        }),
      },
      prompt: 'トヨタ自動車の事業内容を教えてください。',
    });

    writer.merge(result.toUIMessageStream());
  },
});

// ストリームの中身を読み取る
const reader = stream.getReader();

async function readStream() {
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('Stream finished');
        break;
      }
      console.log(JSON.stringify(value, null, 2), '\n');
    }
  } catch (error) {
    console.error('Error reading stream:', error);
  }
}

readStream();
