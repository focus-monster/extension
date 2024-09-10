let streamId: number | undefined;

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message.action) {
    case 'openPopup':
      chrome.action.openPopup();
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
