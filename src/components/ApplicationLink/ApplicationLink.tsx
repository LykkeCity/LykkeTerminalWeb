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
  if (url === window.location.href) {
    return (
      <a className={classes} key={url}>
        {title}
      </a>
    );
  }
  if (!url.includes('http')) {
    return (
      <Link to={url} className={classes} key={url}>
        {title}
      </Link>
    );
  }
  return (
    <a href={url} className={classes} key={url}>
      {title}
    </a>
  );
};

export default ApplicationLink;
