import { defineStorage } from '@aws-amplify/backend';

/**
 * Define and configure your storage resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/storage/
 */
export const storage = defineStorage({
  name: 'cvmakerstorage',
  access: (allow) => ({
    'cv-files/*': [
      allow.guest.to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'pdfs/*': [
      allow.guest.to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});
