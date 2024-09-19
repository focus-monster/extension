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

const result = {
  id: 43,
  userSocialId: '108486714610924629947',
  duration: {
    hours: 0,
    minutes: 30,
  },
  banedSiteAccessLog: [],
  history: [
    "\n[User's Profession]\nThe user’s profession is 'software engineer'. Note that today’s task might not be related to their profession.\n\n[Focus Time]\nThe user decided to focus for 0 hours and 30 minutes.\n\n",
    '\n[User\'s Decided Goal]\n""\n\n',
    '\n[Monitoring]      \n',
    '',
    "\n[Result]\nThe user didn’t hit the focus time goal. \n\nBased on the [Monitoring], If there were distractions to [User's Decided Goal], call them out, but also give some encouragement! \n    \nYou must provide an evaluation between 140~200 characters in english. Make sure to keep the tone playful like a naughty boy speeching.\n",
  ],
  focusStatus: 'FAILED',
  image: 'https://kr.object.ncloudstorage.com/gemini/failure/My%20fellow%20office%20worker.jpg',
  evaluation:
    '"Aw man, you only focused for 30 minutes?  That\'s like, a blink of an eye in the grand scheme of things!  Come on, you can do better than that! 😜  Let\'s try to stay on track tomorrow, alright?\\n"',
  resultDuration: {
    hours: 0,
    minutes: 0,
  },
  createdDateTime: '2024-08-11T10:12:32.429',
  lastModifiedDateTime: '2024-08-11T10:12:35.751',
};
