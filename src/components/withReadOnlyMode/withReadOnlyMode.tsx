import * as React from 'react';
import ReadOnlyMode from './ReadOnlyMode';

interface ReadOnlyModeProps {
  readOnlyMode?: boolean;
}

const withReadOnlyMode = <P extends {}>(Component: React.ComponentType<P>) => ({
  readOnlyMode,
  ...props
}: ReadOnlyModeProps & any) =>
  readOnlyMode === undefined ? null : !readOnlyMode ? (
    <Component {...props} />
  ) : (
    <ReadOnlyMode />
  );

export default withReadOnlyMode;
