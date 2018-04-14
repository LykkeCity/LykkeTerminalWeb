import * as React from 'react';
import ViewMode from './ViewMode';

interface ViewModeProps {
  viewMode?: boolean;
}

const withViewMode = <P extends {}>(Component: React.ComponentType<P>) => ({
  viewMode,
  ...props
}: ViewModeProps & any) =>
  !viewMode ? <Component {...props} /> : <ViewMode />;

export default withViewMode;
