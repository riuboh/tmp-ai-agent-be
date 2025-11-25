import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateObject, streamText } from 'ai';
import { z } from 'zod';

async function main() {
  const query = `トヨタ自動車の事業内容を教えてください。`;

  // 本処理
  const { textStream, steps } = streamText({
    model: openai.responses('gpt-5-nano-2025-08-07'),
    providerOptions: {
      openai: {
        store: false,
        reasoningEffort: 'low',
      },
    },
    tools: {
      web_search: openai.tools.webSearch({
        filters: { allowedDomains: ['jobcatalog.yahoo.co.jp'] },
        searchContextSize: 'low',
      }),
    },
    prompt: query,
  });

  for await (const chunk of textStream) {
    process.stdout.write(chunk);
  }
  console.log(); // 改行
  console.log('Steps:', JSON.stringify(await steps, null, 2));
  console.log(); // 改行
}

main();
