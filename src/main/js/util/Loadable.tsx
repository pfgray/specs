import * as React from 'react';
import { Icon } from 'antd';
import { fromRenderProp, withPromise, ChainableComponent } from 'chainable-components';

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
  return withPromise({get: config}).chain(req => {
    return withLoadable(req);
  });
};

const withLoadable = fromRenderProp(Loadable);

export default withLoadable;