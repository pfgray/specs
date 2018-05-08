import React from 'react';
import { withPromise } from 'chainable-components';
import axios from 'axios';
import { List, Icon, Row, Col } from 'antd';

import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';

function delay(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t)
  });
}

Promise.prototype.delay = function (t) {
  return this.then(function (v) {
    return delay(t, v);
  });
}

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

const Organizations = () =>
  withAuth().chain(token =>
    withPromise({
      get: () => axios.get('/api/organizations', {
        headers: { Authorization: token }
      }).delay(500)
    }).chain(orgReq =>
      withLoading(orgReq).map(orgs => [orgs, token])
    )
  ).ap(([orgs, token]) => (
    <Row gutter={16}>
      <Col className='gutter-row' span={14} offset={5}>
        <div className='gutter-box'>
          <h1>These are the orgs?</h1>
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 3,
            }}
            dataSource={orgs.organizations}
            renderItem={item => (
              <List.Item
                key={item.name}
                actions={[<IconText type="book" text="..." />, <IconText type="user" text="..." />]}
                extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
              >
                <List.Item.Meta
                  title={<a href={'http://www.google.com'}>{item.name}</a>}
                  description={"this is the course description"}
                />
                {item.name}
              </List.Item>
            )}
          />
        </div>
      </Col>
    </Row>
  ))

export default Organizations;