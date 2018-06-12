import { fromAp } from 'chainable-components';
import * as lscache from 'lscache';

const withAuth = fromAp<string>(render => {
  const token: string = lscache.get('auth_token');
  return render(token);
});

export default withAuth;