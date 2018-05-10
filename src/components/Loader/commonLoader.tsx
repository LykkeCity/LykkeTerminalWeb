import * as React from 'react';
import {Spinner} from './Spinner';
import {Centered, CommonLoaderWrapper, LoadingDescription} from './styles';

export interface CommonLoaderProps {
  loadingDescription?: string;
}

const CommonLoader: React.SFC<CommonLoaderProps> = ({loadingDescription}) => (
  <CommonLoaderWrapper>
    <Centered>
      <Spinner />
    </Centered>
    <LoadingDescription>{loadingDescription}</LoadingDescription>
  </CommonLoaderWrapper>
);

export default CommonLoader;
