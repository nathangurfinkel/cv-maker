import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { function as cvmakerapi } from './function/cvmakerapi/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
  cvmakerapi,
});

// Grant the function access to the storage bucket
backend.storage.resources.bucket.grantReadWrite(backend.cvmakerapi.resources.lambda);
