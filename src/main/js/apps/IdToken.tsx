import { Button } from 'antd';
import { withState } from 'chainable-components';
import * as React from 'react';

export type IdTokenProps = {
  token: string
};

const IdToken = (props: IdTokenProps) => {
  return withState(false).render((isOpen) => {
    const parts = props.token.split('.');
    return (
      <div className={'id-token' + (isOpen.value ? ' open' : '')}>
        <div className='id-token-contents'>
          <span className='header'>{parts[0]}</span>.
          <span className='payload'>{parts[1]}</span>.
          <span className='signature'>{parts[2]}</span>
        </div>
        <div className='collapser'>
          {isOpen.value ? (
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