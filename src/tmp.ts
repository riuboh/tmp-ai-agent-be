import 'dotenv/config';
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

async function main() {
  const result = streamText({
    model: openai('gpt-4o'),
    prompt: 'おはよう',
  });

  // example: use textStream as an async iterable
  for await (const textPart of result.textStream) {
    console.log(textPart);
  }
}

main().catch(console.error);
