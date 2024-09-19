let streamId: number | undefined;
let payload:
  | {
      result: string;
      evaluation: string;
      resultDuration: number;
      image: string;
      focusStatus: string;
      level: number;
    }
  | undefined;
let globalPort: chrome.runtime.Port | undefined;

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message.action) {
    case 'openPopup':
      chrome.action.openPopup();
      payload = message.payload;
      globalPort?.postMessage({ action: 'setResult', payload: payload });
      break;
    case 'requestCapture':
      streamId = chrome.desktopCapture.chooseDesktopMedia(['screen'], streamId => {
        sendResponse({ success: !!streamId, streamId });
      });
      break;
    case 'stopCapture':
      if (streamId) chrome.desktopCapture.cancelChooseDesktopMedia(streamId);
      break;
    default:
      console.error('Unknown action:', message.action);
  }
  return true;
});

chrome.runtime.onConnect.addListener(port => {
  globalPort = port;
  port.onMessage.addListener(message => {
    if (message.action === 'popupMounted' && payload) {
      port.postMessage({ action: 'setResult', payload });
      payload = undefined;
    }
  });
});
