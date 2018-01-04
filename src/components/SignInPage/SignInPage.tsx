import * as React from 'react';
import styled from 'styled-components';
import AuthStore from '../../stores/authStore';

const StyledSignInForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledErrors = styled.span`
  color: red;
`;

interface SignInPageState {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  commonError: string;
}

interface SignInPageProps {
  authStore: AuthStore;
  history: any;
}

class SignInPage extends React.Component<SignInPageProps, SignInPageState> {
  constructor(props: SignInPageProps) {
    super(props);
    this.state = {
      commonError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: ''
    };
  }

  emailChangeHandler = (e: any) => {
    this.setState({
      email: e.target.value
    });
  };

  passwordChangeHandler = (e: any) => {
    this.setState({
      password: e.target.value
    });
  };

  SignIn = () => {
    if (!this.state.password.length || !this.state.email.length) {
      return;
    }

    this.props.authStore
      .fetchBearerToken(this.state.email, this.state.password)
      .then(res => {
        this.props.history.push('/');
      })
      .catch(error => {
        const emailError = error.Email ? error.Email : '';
        const passwordError = error.Password ? error.Password : '';
        const commonError = error.message ? error.message : '';
        this.setState({emailError});
        this.setState({passwordError});
        this.setState({commonError});
      });
  };

  render() {
    return (
      <StyledSignInForm>
        <input
          type="email"
          value={this.state.email}
          onChange={this.emailChangeHandler}
        />
        <StyledErrors>{this.state.emailError}</StyledErrors>
        <input
          type="password"
          value={this.state.password}
          onChange={this.passwordChangeHandler}
        />
        <StyledErrors>{this.state.passwordError}</StyledErrors>
        <StyledErrors>{this.state.commonError}</StyledErrors>
        <button
          type="button"
          disabled={!(this.state.email.length && this.state.password.length)}
          onClick={this.SignIn}
        >
          Log in
        </button>
      </StyledSignInForm>
    );
  }
}

export default SignInPage;
