import * as React from 'react';
import {Spinner} from './Spinner';
import {Centered} from './styles';

export interface LoaderProps {
  loading?: boolean;
}

const withLoader = <P extends LoaderProps>(loading: (p: P) => boolean) => (
  Component: React.ComponentType<P>
) => (props: P) =>
  loading(props) ? (
    <React.Fragment>
      <Component {...props} />
      <Centered>
        <Spinner />
      </Centered>
    </React.Fragment>
  ) : (
    <Component {...props} />
  );

export default withLoader;
