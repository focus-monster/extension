import { createRoot } from 'react-dom/client';
import App from '@src/app';
// eslint-disable-next-line
// @ts-ignore
import tailwindcssOutput from '@src/tailwind-output.css?inline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { bannedSiteLogStorage, bannedSiteStorage, focusStorage } from '../../../packages/storage';

const root = document.createElement('div');
root.id = 'chrome-extension-boilerplate-react-vite-content-view-root';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

/** Inject styles into shadow dom */
const globalStyleSheet = new CSSStyleSheet();
globalStyleSheet.replaceSync(tailwindcssOutput);
shadowRoot.adoptedStyleSheets = [globalStyleSheet];
/**
 * In the firefox environment, the adoptedStyleSheets bug may prevent style from being applied properly.
 *
 * @url https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
 * @url https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/pull/174
 *
 * Please refer to the links above and try the following code if you encounter the issue.
 *

 * const styleElement = document.createElement('style');
 * styleElement.innerHTML = tailwindcssOutput;
 * shadowRoot.appendChild(styleElement);
 * ```
 */

export const queryClient = new QueryClient();

shadowRoot.appendChild(rootIntoShadow);
createRoot(rootIntoShadow).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);

window.addEventListener('message', async event => {
  if (event.data.action === 'openPopup') {
    chrome.runtime.sendMessage({ action: 'openPopup', payload: event.data.payload });
  }
});

const main = async () => {
  const hostname = new URL(window.location.href).hostname;
  const bannedSites = (await JSON.parse(await bannedSiteStorage.get())) as string[];
  const isFocus = (await JSON.parse(await focusStorage.get())) as boolean;

  if (isFocus && bannedSites.some(site => hostname.includes(site.toLowerCase()))) {
    console.log("You're on a banned site");
    const bannedSite = capitalizeFirstLetter(bannedSites.find(site => hostname.includes(site))!);

    if (bannedSite) {
      const bannedSiteLog = (await JSON.parse(await bannedSiteLogStorage.get())) as { [key: string]: number };
      console.log('before: ', bannedSiteLog);
      if (typeof bannedSiteLog[bannedSite] === 'undefined') {
        bannedSiteLog[bannedSite] = 0;
      } else {
        bannedSiteLog[bannedSite] = bannedSiteLog[bannedSite] + 1;
      }

      await bannedSiteLogStorage.set(JSON.stringify(bannedSiteLog));
      console.log('after: ', bannedSiteLog);
    }
  }
};

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

main();
