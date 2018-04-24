import * as React from 'react';
import ViewMode from './ViewMode';

interface ViewModeProps {
  viewMode?: boolean;
}

const withViewMode = <P extends {}>(Component: React.ComponentType<P>) => ({
  viewMode,
  ...props
}: ViewModeProps & any) =>
  viewMode === undefined ? null : !viewMode ? (
    <Component {...props} />
  ) : (
    <ViewMode />
  );

export default withViewMode;
