import { withErrorBoundary, withSuspense } from '@extension/shared';
import '@src/Options.css';

const Options = () => {
  return <></>;
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
