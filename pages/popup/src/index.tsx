import Popup from '@src/Popup';
import '@src/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { ErrorProvider } from './error';
import { ResultProvider } from './result';

export const queryClient = new QueryClient();

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <ResultProvider>
          <Popup />
        </ResultProvider>
      </ErrorProvider>
    </QueryClientProvider>,
  );
}

init();
