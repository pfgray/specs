import { ChainableComponent } from 'chainable-components';
import * as lscache from 'lscache';

const withAuth = ChainableComponent.of(lscache.get('auth_token') as string);

export default withAuth;