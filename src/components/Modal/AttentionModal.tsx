import {inject} from 'mobx-react';
import * as React from 'react';
import ModalModel from '../../models/modalModel';
import {AuthStore} from '../../stores/index';
import {
  AttentionWrapper,
  ImgLink,
  MarginedBody,
  Title,
  Wrapper
} from './styles';

interface AttentionModalProps {
  authStore: AuthStore;
  modal: ModalModel;
}

@inject('authStore')
class AttentionModal extends React.Component<AttentionModalProps> {
  render() {
    const goToAppStore = () =>
      this.redirect(this.props.modal.message.link.appStore);
    const goToPlayMarket = () =>
      this.redirect(this.props.modal.message.link.playMarket);

    return (
      <AttentionWrapper>
        <Wrapper>
          <Title>{this.props.modal.message.title}</Title>
          <div onClick={this.close}>X</div>
        </Wrapper>
        <MarginedBody>{this.props.modal.message.body}</MarginedBody>
        <Wrapper>
          <ImgLink onClick={goToAppStore} image={'app-store'} />
          <ImgLink onClick={goToPlayMarket} image={'google-play'} />
        </Wrapper>
      </AttentionWrapper>
    );
  }

  private redirect = (link?: string) => {
    if (this.props.modal.message.signOut) {
      this.props.authStore.signOut(link || '');
    } else {
      location.replace(link || '/');
    }
  };

  private close = () => {
    if (this.props.modal.message.signOut) {
      this.props.authStore.signOut();
    } else {
      this.props.modal.close();
    }
  };
}

export default AttentionModal;
