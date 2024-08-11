import { useAuth } from '../../../shared';

export function Auth() {
  const { data, isLoading } = useAuth();

  if (isLoading) {
    return <span>Loading...</span>;
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
      className=" font-semibold hover:underline underline-offset-2">{`${data.nickname}'s home 🏠`}</a>
  );
}
