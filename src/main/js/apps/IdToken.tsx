import * as React from 'react';
import { withState } from 'chainable-components';
import { Icon, Button } from 'antd';

export type IdTokenProps = {
  token: string
};

const IdToken = (props: IdTokenProps) => {
  return withState({ initial: false }).ap((isOpen) => {
    const parts = props.token.split('.');
    return (
      <div className={'id-token' + (isOpen.data ? ' open' : '')}>
        <div className='id-token-contents'>
          <span className='header'>{parts[0]}</span>.
          <span className='payload'>{parts[1]}</span>.
          <span className='signature'>{parts[2]}</span>
        </div>
        <div className='collapser'>
          {isOpen.data ? (
            <Button icon="arrow-up" htmlType='button' onClick={() => isOpen.update(false)}>collapse</Button>
          ) : (
            <Button icon="arrow-down" htmlType='button' onClick={() => isOpen.update(true)}>expand</Button>
          )}
        </div>
      </div>
    );
  });
};

export default IdToken;