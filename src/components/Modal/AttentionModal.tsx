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
    return (
      <AttentionWrapper>
        <Wrapper>
          <Title>{this.props.modal.message.title}</Title>
          <div onClick={this.close}>X</div>
        </Wrapper>
        <MarginedBody>{this.props.modal.message.body}</MarginedBody>
        <Wrapper>
          <ImgLink
            href={this.props.modal.message.link.appStore}
            target={'_blank'}
            onClick={this.close}
            image={'app-store'}
          />
          <ImgLink
            href={this.props.modal.message.link.playMarket}
            target={'_blank'}
            onClick={this.close}
            image={'google-play'}
          />
        </Wrapper>
      </AttentionWrapper>
    );
  }

  private close = () => {
    if (this.props.modal.message.signOut) {
      this.props.authStore.signOut();
    } else {
      this.props.modal.close();
    }
  };
}

export default AttentionModal;
