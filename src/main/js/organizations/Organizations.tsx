import * as React from 'react';
import { withPromise } from 'chainable-components';
import axios from 'axios';
import { List, Icon, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';

import withAuth from '../util/AuthContext';
import withLoading from '../util/Loadable';
import IconText from '../components/IconText';

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

const Organizations = () =>
  withAuth.chain(token => {
    return withPromise({
      get: () => axios.get('/api/organizations', {
        headers: { Authorization: token }
      })
    })
    .chain(orgReq =>
      withLoading(orgReq).map(orgs => [orgs.data, token])
    )
  }).ap(([orgs, token]) => (
    <Row gutter={16}>
      {/* <pre>{JSON.stringify(props, null, 2)}</pre> */}
      <Col className='gutter-row' span={14} offset={5}>
        <div className='gutter-box' style={{ marginTop: '2rem' }}>
          <Link className='ant-btn ant-btn-primary' to='/organizations/new'>
            <i className="anticon anticon-plus"></i>
            <span>New organization</span>
          </Link>
        </div>
        <div className='gutter-box' style={{ marginTop: '2rem' }}>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={orgs.organizations}
            renderItem={item => (
              <List.Item
                key={item.org.name}
                actions={[
                  <Link to={`/organizations/${item.org.id}/courses`}><IconText type="book" text={item.aggregates.coursesCount} /></Link>,
                  <Link to={`/organizations/${item.org.id}/users`}><IconText type="user" text={item.aggregates.usersCount}/></Link>
                ]}
                extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
              >
                <List.Item.Meta
                  title={<Link to={`/organizations/${item.org.id}/courses`}>{item.org.name}</Link>}
                  description={"this is the course description"}
                />
                {item.org.name}
                <div>
                  <Link to={`/organizations/edit/${item.org.id}`}>edit</Link>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Col>
    </Row>
  ))

export default Organizations;