import '@src/Popup.css';
import { Session, useStorageSuspense, withErrorBoundary, withSuspense } from '@extension/shared';
import { bannedSiteStorage, socialIdStorage } from '@extension/storage';
import { SmallBox } from './small-box';
import { useError } from './error';
import { useResult } from './result';
import { Auth } from './auth-button';

const Popup = () => {
  const { error } = useError();
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
  return (
    <>
      {error?.length && error.length > 0 ? (
        <div className=" left-1/2 -translate-x-1/2 bg-red-600 rounded-lg text-white absolute text-center top-4 px-4 py-2 z-50">
          {error}
        </div>
      ) : null}
      {result ? <BigBox result={result} /> : <SmallBox />}
    </>
  );
};

function BigBox({ result }: { result: Omit<Omit<Session, 'nickname'>, 'level'> }) {
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
      <div className="w-full flex flex-col items-center grow pt-4 overflow-hidden"></div>
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
