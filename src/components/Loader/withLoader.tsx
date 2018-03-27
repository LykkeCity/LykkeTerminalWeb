import * as React from 'react';
import {Spinner} from './Spinner';
import {Centered} from './styles';

const withLoader = <P extends {}>(loading: (p: P) => boolean) => (
  Component: React.ComponentType<P>
) => (props: P) =>
  loading(props) ? (
    <Centered>
      <Spinner />
    </Centered>
  ) : (
    <Component {...props} />
  );

export default withLoader;
