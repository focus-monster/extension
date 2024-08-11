import { withErrorBoundary, withSuspense } from '@extension/shared';
import '@src/Panel.css';

const Panel = () => {
  return <></>;
};

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), <div> Error Occur </div>);
