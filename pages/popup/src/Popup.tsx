import '@src/Popup.css';
import { type Session, useAuth, useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { bannedSiteStorage, socialIdStorage } from '@extension/storage';
import { SmallBox } from './small-box';
import { useError } from './error';
import { Auth } from './auth-button';
import { cn } from '@extension/ui';
import { useContext, useEffect } from 'react';
import { resultContext } from './result';

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

type Result = typeof result;

const Popup = () => {
  const { error } = useError();
  const { data: auth } = useAuth();
  const { result, setResult } = useContext(resultContext);

  useEffect(() => {
    const port = chrome.runtime.connect({ name: 'popup' });
    port.postMessage({ action: 'popupMounted' });
    port.onMessage.addListener(message => {
      setResult(null);
      if (message.action === 'setResult') {
        setResult(JSON.parse(message.payload));
      }
    });

    return () => {
      port.disconnect();
    };
  });

  return (
    <>
      {error?.length && error.length > 0 ? (
        <div className=" left-1/2 -translate-x-1/2 bg-red-600 rounded-lg text-white absolute text-center top-4 px-4 py-2 z-50">
          {error}
        </div>
      ) : null}
      {result ? <BigBox result={{ ...result, level: auth?.level ?? 0 }} /> : <SmallBox />}
    </>
  );
};

function BigBox({ result }: { result: Session & { level: number } }) {
  return (
    <div
      className="flex flex-col items-center"
      style={{
        backgroundImage: 'url(/box-lg.png)',
        backgroundSize: 'cover',
        width: '694px',
        height: '601px',
      }}>
      <div className="w-full flex justify-end py-3.5 text-lg px-10">
        <Auth />
      </div>
      <div className="w-full h-[500px] flex flex-col items-center grow py-6 overflow-hidden">
        <div className="grid grid-cols-[1fr,2fr] px-6 gap-2 h-full">
          <Result result={result.focusStatus} />
          <div className="text-base font-semibold px-2 line-clamp-4">{JSON.parse(result.evaluation)}</div>
          <div className="px-2 flex flex-col justify-between">
            <Duration duration={result.resultDuration} />
            <Level level={result.level} result={result.focusStatus} />
            <Character result={result.focusStatus} level={result.level} />
          </div>
          <div className="overflow-hidden object-contain">
            <Image image={result.image} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Result({ result }: { result: string }) {
  if (result === 'FAILED') {
    return <img src="/fail.png" alt="failed" />;
  }
  if (result === 'SUCCEED') {
    return <img src="/success.png" alt="success" />;
  }
  return <></>;
}

function Duration({ duration }: { duration: { hours: number; minutes: number } }) {
  return (
    <div className="w-full py-2 flex flex-row gap-4 items-center">
      <img style={{ width: '46px', height: '45px' }} src="/clock.png" alt="clock" />
      <div>
        <div className="font-semibold">You stayed focus for</div>
        <div className="text-4xl font-bold">
          {duration.hours}h {duration.minutes}m
        </div>
      </div>
    </div>
  );
}

function Level({ level, result }: { level: number; result: string }) {
  const { isLoading } = useAuth();
  return (
    <div className="w-full py-2 flex flex-row gap-4 items-center">
      <img src={result === 'SUCCEED' ? '/up.png' : '/stop.png'} alt="level" />
      <div>
        <div className="font-semibold">{result === 'SUCCEED' ? 'Level up' : 'Level stays at'}</div>
        <div className="text-4xl font-bold flex items-center gap-2">
          LV. {isLoading ? <div className="w-8 h-8 bg-black/20 rounded-lg animate-pulse"></div> : level}
        </div>
      </div>
    </div>
  );
}

function Character({ result, level }: { result: string; level: number }) {
  const url = `${result === 'SUCCEED' ? '/success/' : '/fail/'}` + `${levelMap(level)}.png`;
  return (
    <div className={cn('pt-4')}>
      <img src={url} alt={url} width="176px" height="162px"></img>
    </div>
  );
}

function levelMap(level: number) {
  if (level < 5) return 0;
  if (level < 30) return 5;
  if (level < 70) return 30;
  if (level < 100) return 70;
  return 100;
}

function Image({ image }: { image: string }) {
  return (
    <div
      style={{
        backgroundImage: `url(/frame.png)`,
        backgroundSize: '100% 100%',
        width: 'fit-content',
        height: 'fit-content',
        backgroundRepeat: 'no-repeat',
      }}
      className="p-2 relative mx-auto pb-6">
      <img src={image} alt="meme" className="object-contain object-center h-[310px]" />
      <img src="/frame.png" alt="frame" className="absolute top-0 left-0 h-full w-full" />
    </div>
  );
}
export function SocialId() {
  const socialId = useStorageSuspense(socialIdStorage);
  return <div>{socialId}</div>;
}

export function BannedSites() {
  const bannedSites = useStorageSuspense(bannedSiteStorage);
  return <div>{bannedSites}</div>;
}

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
