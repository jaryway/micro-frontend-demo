import React, { useCallback } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Authorized from './Authorized';
// import { isUrl } from 'Util/utils';

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

function AuthorizedRoute({ component: Component, render, authority, redirectPath, ...rest }) {
  const redirect = useCallback(() => {
    if (isUrl(redirectPath)) {
      window.location.href = redirectPath;
      return null;
    }
    return <Redirect to={{ pathname: redirectPath }} />;
  }, [redirectPath]);

  return (
    <Authorized authority={authority} noMatch={<Route {...rest} render={redirect} />}>
      <Route {...rest} render={props => (Component ? <Component {...props} /> : render(props))} />
    </Authorized>
  );
}

export default AuthorizedRoute;
