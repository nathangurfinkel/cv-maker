import { defineFunction } from '@aws-amplify/backend';

/**
 * Define and configure your function
 * @see https://docs.amplify.aws/gen2/build-a-backend/functions/
 */
export const cvmakerapi = defineFunction({
  name: 'cvmakerapi',
  entry: './cvmakerapi/handler.py',
  runtime: 20,
  timeoutSeconds: 30,
  memoryMB: 1024,
  environment: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
  },
});
