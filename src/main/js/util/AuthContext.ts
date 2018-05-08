import * as React from 'react';
import { fromAp } from 'chainable-components';
import * as lscache from 'lscache';

const withAuth = fromAp<string>(render => {
  const token = lscache.get('auth_token');
  console.log('got token: ', token);
  return render(token);
});

export default withAuth;