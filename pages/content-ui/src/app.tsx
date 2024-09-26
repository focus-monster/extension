import { useStorageSuspense } from '@extension/shared';
import { bannedSiteStorage, focusStorage } from '../../../packages/storage';
import { useEffect } from 'react';

export default function App() {
  const bannedSites = JSON.parse(useStorageSuspense(bannedSiteStorage)) as string[];
  const isFocus = JSON.parse(useStorageSuspense(focusStorage)) as boolean;
  const currentTab = new URL(window.location.href).hostname;

  useVideo();

  if (!bannedSites) {
    console.log('no banned sites');
  }

  if (
    isFocus &&
    bannedSites.some(site => {
      return currentTab.includes(site);
    })
  ) {
    return (
      <div className="fixed top-0 inset-0 z-[9999999] isolate bg-blue-400/50 backdrop-blur-lg grid place-content-center">
        <div
          className="flex flex-col items-center"
          style={{
            backgroundImage: 'url(/box-sm.png)',
            backgroundSize: 'cover',
            width: '610px',
            height: '270px',
          }}></div>
      </div>
    );
  }
  return (
    <div>
      <button
        onClick={() => {
          chrome.runtime.sendMessage({ action: 'requestCapture' }, response => {
            if (response.success) {
              getMedia(response.streamId);
            }
          });
        }}>
        START RECORDING
      </button>
      <button
        onClick={() => {
          chrome.runtime.sendMessage({ action: 'stopCapture' });
        }}>
        STOP RECORDING
      </button>
    </div>
  );
}

async function getMedia(streamId: string) {
  const media = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: streamId,
      width: { max: 1920 },
      height: { max: 1080 },
    },
  });

  const video = document.createElement('video');
  video.srcObject = media;
  video.autoplay = true;
  document.body.appendChild(video);

  video.addEventListener('loadedmetadata', () => {
    video.play();

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    setInterval(() => {
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async blob => {
        if (blob) {
          console.log('blob', blob);
        }
      }, 'image/png');
    }, 1000);
  });
}

function useVideo() {
  useEffect(() => {
    chrome.runtime.onMessage.addListener(getMedia);

    return () => {
      chrome.runtime.onMessage.removeListener(getMedia);
    };
  }, []);
}
