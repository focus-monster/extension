import { useAuth } from '@extension/shared';

export function Auth() {
  const { data, isLoading } = useAuth();

  if (isLoading) {
    return <div className="w-48 h-7 bg-gray-600/20 rounded-lg animate-pulse" />;
  }

  if (!data) {
    return (
      <a
        target="_blank"
        rel="noreferrer"
        href="https://focusmonster.me"
        className=" font-semibold hover:underline underline-offset-2">
        Go to Homepage 🏠
      </a>
    );
  }

  return (
    <a
      target="_blank"
      rel="noreferrer"
      href="https://focusmonster.me"
      className=" font-semibold hover:underline underline-offset-2">
      <LoadingUsername nickname={data.nickname} isLoading={isLoading} />
    </a>
  );
}

function LoadingUsername({ nickname, isLoading }: { nickname: string; isLoading: boolean }) {
  return (
    <>{isLoading ? <div className="w-12 h-8 bg-black/20 rounded-lg animate-pulse"></div> : nickname}&apos;s home 🏠</>
  );
}
