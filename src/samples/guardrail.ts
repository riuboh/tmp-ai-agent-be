import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { generateObject, streamText } from 'ai';
import { z } from 'zod';

async function main() {
  const query = `私は山田太郎です。世田谷区で一番美味しいラーメン屋を教えてください。`;

  // ガードレール処理
  const { object: guardrail } = await generateObject({
    model: openai('gpt-4o-mini-2024-07-18'),
    schema: z.object({
      isSecret: z
        .boolean()
        .describe('ユーザの個人情報を含む場合は true、含まない場合は false'),
    }),
    prompt: `次の文がユーザの個人情報を含むものかどうかを判定してください。文:${query}`,
  });

  // 個人情報を含む場合は処理を中止
  if (guardrail.isSecret) {
    console.log('ユーザの個人情報を含むため、処理を中止しました。');
    return;
  }

  // 本処理
  const { textStream } = streamText({
    model: openai('gpt-5-mini'),
    prompt: query,
  });

  for await (const chunk of textStream) {
    process.stdout.write(chunk);
  }
  console.log(); // 改行
}

main();
