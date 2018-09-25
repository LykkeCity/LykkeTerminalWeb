import * as React from 'react';
import NotVerified from './NotVerified';
import {DisabledContainer} from './styles';

interface KycProps {
  isKycPassed?: boolean;
}

const withKyc = <P extends {}>(
  Component: React.ComponentType<P>,
  withAction = true
) => ({isKycPassed, ...props}: KycProps & any) => {
  if (isKycPassed) {
    return <Component {...props} />;
  }

  const onDisabledClick = (event: any) => {
    event.stopPropagation();
    event.preventDefault();

    // Required to remove react event handlers to prevent incorrect requests
    event.target.outerHTML = event.target.outerHTML;
  };

  return (
    <React.Fragment>
      <DisabledContainer onClick={onDisabledClick}>
        <Component {...props} />
      </DisabledContainer>
      {withAction ? (
        <NotVerified
          href={`${process.env.REACT_APP_KYC_URL}?returnUrl=${
            window.location.origin
          }`}
        />
      ) : null}
    </React.Fragment>
  );
};

export default withKyc;
