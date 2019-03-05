import * as React from 'react';
import {Link} from 'react-router-dom';

interface ApplicationLinkProps {
  classes: string;
  title: JSX.Element;
  url: string;
}

const ApplicationLink: React.SFC<ApplicationLinkProps> = ({
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
    <a href={customUrl} className={classes}>
      {title}
    </a>
  );
};

export default ApplicationLink;
