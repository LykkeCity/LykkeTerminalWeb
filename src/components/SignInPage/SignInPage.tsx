import * as React from 'react';
import styled from 'styled-components';
import ErrorMessage from './ErrorMessage';
import {SignInPageProps, SignInPageState} from './index';
import InputField from './InputField';

const StyledSignInForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #000;
  transition: none;
`;

const StyledForm = styled.form`
  width: 300px;
  border: 1px solid #ccc;
  padding: 40px;
`;

const StyledButtonWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

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

  submitHandler = (e: any) => {
    e.preventDefault();
  };

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

  signIn = () => {
    if (!this.state.password.length || !this.state.email.length) {
      return;
    }

    this.props.authStore
      .fetchBearerToken(this.state.email, this.state.password)
      .then(() => {
        this.props.history.push('/');
      })
      .catch(error => {
        const emailError = error.Email ? error.Email : '';
        const passwordError = error.Password ? error.Password : '';
        const commonError = error.message ? error.message : '';
        this.setState({emailError, passwordError, commonError});
      });
  };

  render() {
    return (
      <StyledSignInForm>
        <StyledForm onSubmit={this.submitHandler}>
          <InputField
            id={'email'}
            inputValue={this.state.email}
            change={this.emailChangeHandler}
            errorMessage={this.state.emailError}
          />

          <InputField
            id={'password'}
            inputValue={this.state.password}
            change={this.passwordChangeHandler}
            errorMessage={this.state.passwordError}
          />
          <ErrorMessage errorMessage={this.state.commonError} />

          <StyledButtonWrap>
            <button
              type="submit"
              disabled={
                !(this.state.email.length && this.state.password.length)
              }
              onClick={this.signIn}
            >
              Sign in
            </button>
          </StyledButtonWrap>
        </StyledForm>
      </StyledSignInForm>
    );
  }
}

export default SignInPage;
