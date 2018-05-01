import React from 'react';
import { buildChainable } from 'chainable-components';
import lscache from 'lscache';

// grab it from context?!?
const AuthContext = props => {
  const token = lscache.get('auth_token');
  console.log('got token: ', token);
  return props.children(token);
};

const withAuth = buildChainable(AuthContext);

export default withAuth;