import { withErrorBoundary, withSuspense } from '@extension/shared';
import '@src/SidePanel.css';

const SidePanel = () => {
  return <></>;
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
