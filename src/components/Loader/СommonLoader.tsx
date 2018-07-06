import * as React from 'react';
import {Spinner} from './Spinner';
import {
  Background,
  Centered,
  CommonLoaderWrapper,
  LoadingDescription
} from './styles';

export interface CommonLoaderProps {
  backColor?: string;
  loadingDescription?: string;
}

const CommonLoader: React.SFC<CommonLoaderProps> = ({
  backColor,
  loadingDescription
}) => (
  <Background back={backColor}>
    <CommonLoaderWrapper>
      <Centered>
        <Spinner />
      </Centered>
      <LoadingDescription>{loadingDescription}</LoadingDescription>
    </CommonLoaderWrapper>
  </Background>
);

export default CommonLoader;
