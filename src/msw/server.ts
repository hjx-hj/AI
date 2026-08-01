import { setupWorker, type SetupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker: SetupWorker = setupWorker(...handlers);

export const startMockServer = (): void => {
  if (process.env.NODE_ENV === 'development') {
    worker.start({
      onUnhandledRequest: 'warn',
    });
  }
};