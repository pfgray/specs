import { Icon } from 'antd';
import { ChainableComponent, fromRenderProp, withPromise } from 'chainable-components';
import { WithPromiseState } from 'chainable-components/lib/lib/withPromise';
import * as React from 'react';

type LoadableProps<A> = LoadableData<A> & {
  children: (a: A) => React.ReactNode
};

type LoadableData<T> = {
  loading: true
} | {
  loading: false,
  data: T
};

export function Loadable<A>(props: LoadableProps<A>): React.ReactNode {
  return props.loading ? <Icon type="loading" /> : props.children(props.data);
};

export function withLoadablePromise<A>(config: () => Promise<A>): ChainableComponent<A> {
  return withPromise(config).chain(req => {
    return withLoadable(req);
  });
};

function withLoadable<A>(req: WithPromiseState<A>): ChainableComponent<A> {
  return fromRenderProp<LoadableProps<A>>(Loadable as any, req);
}

export default withLoadable;