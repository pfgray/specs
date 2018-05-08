import * as React from 'react';
import { fromRenderProp } from 'chainable-components';
import * as lscache from 'lscache';

const LoadIcon = () => (
  <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#1890ff">
    {/*By Sam Herbert (@sherb), for everyone.More @http://goo.gl/7AJzbL */}
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(1 1)" stroke-width="2">
        <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite" />
        </path>
      </g>
    </g>
  </svg>
);

const Loadable = (props: any) => {
  console.log('LOLOLOL got', props);
  return props.loading ? <LoadIcon /> : props.children(props.data);
};

const withLoadable = fromRenderProp(Loadable);

export default withLoadable;