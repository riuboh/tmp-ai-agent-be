import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { createUIMessageStream, streamText, tool, type UIMessage } from 'ai';
import { z } from 'zod';

export type MyUIMessage = UIMessage<
  unknown, // 第1引数: Metadata（使用しない場合は unknown）
  {
    hello: string; // 第2引数: Data Parts
    goodbye: string;
  }
>;

const stream = createUIMessageStream<MyUIMessage>({
  execute: async ({ writer }) => {
    writer.write({
      type: 'data-hello',
      data: 'Hello!',
    });

    const result = streamText({
      model: openai('gpt-4'),
      prompt: 'Say hello',
    });

    writer.write({
      type: 'data-goodbye',
      data: 'Goodbye!',
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
