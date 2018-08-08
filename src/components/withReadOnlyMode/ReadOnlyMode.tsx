import {inject} from 'mobx-react';
import * as React from 'react';
import {RootStore} from '../../stores';
import styled from '../styled';

const Link = styled.a`
  color: ${props => props.theme.colors.linkText};
  cursor: pointer;
  text-decoration: underline;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const mapStoreToProps = ({sessionStore}: RootStore) => ({
  startTrade: sessionStore.startTrade
});

const ReadOnlyMode = inject(mapStoreToProps)(({startTrade}) => (
  <Centered>
    <Link onClick={startTrade}>Scan QR</Link>&nbsp;to start trading
  </Centered>
));

export default ReadOnlyMode;
