import React from 'react';
import { withPromise } from 'chainable-components';
import axios from 'axios';

import withAuth from '../util/AuthContext';

const Organizations = () =>
  withAuth().chain(token => 
    withPromise({
      get: () => axios.get('/api/organizations', {
        headers: { Authorization: token }
      })
    }).map(orgs => [orgs, token])
  ).ap(([orgs, token]) => (
    <div>
      <h1>These are the orgs?</h1>
      <pre>
        {JSON.stringify(orgs, null, 2)}
      <pre>
      </pre>
        {JSON.stringify(token, null, 2)}
      </pre>
    </div>
  ))

export default Organizations;