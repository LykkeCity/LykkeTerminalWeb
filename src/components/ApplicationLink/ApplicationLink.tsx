import * as React from 'react';
import {Link} from 'react-router-dom';

interface ApplicationLinkProps {
  isBlank?: boolean;
  classes: string;
  title: JSX.Element;
  url: string;
}

const ApplicationLink: React.SFC<ApplicationLinkProps> = ({
  isBlank,
  classes,
  title,
  url
}) => {
  if (!url.includes('http')) {
    return (
      <Link to={url} className={classes} key={url}>
        {title}
      </Link>
    );
  }

  const customUrl = url === window.location.href ? undefined : url;
  return (
    <a
      href={customUrl}
      target={isBlank ? '_blank' : undefined}
      className={classes}
    >
      {title}
    </a>
  );
};

export default ApplicationLink;
