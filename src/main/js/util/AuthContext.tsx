import * as React from 'react';
import { ChainableComponent, fromRender } from 'chainable-components';
import * as lscache from 'lscache';
import Login from '../auth/Login';

const withAuth =
  fromRender<string>(f => {
    const token = lscache.get('auth_token') as string | null;
    if(token) {
      return f(token);
    } else {
      // render login?
      return <Login />;
    }
  });


export default withAuth;