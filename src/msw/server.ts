import { setupWorker, type SetupWorker } from 'msw/browser';
import { handlers } from './handlers';

const workerUrl = import.meta.env.BASE_URL + 'mockServiceWorker.js';

export const worker: SetupWorker = setupWorker(...handlers);

export const startMockServer = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.PROD) {
    await worker.start({
      serviceWorker: {
        url: workerUrl,
      },
      onUnhandledRequest: 'warn',
    });
  }
};