import * as React from 'react';
import { List, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import withAuth from '../util/AuthContext';
import { withLoadablePromise } from '../util/Loadable';
import IconText from '../components/IconText';
import { getOrganizations, OrganizationWithAggregate } from '../resources';
import { ChainableComponent } from 'chainable-components';
import BreadcrumbLayout from '../layout/BreadcrumbLayout';

const Organizations = () =>
  ChainableComponent.Do(
    withAuth,
    token => withLoadablePromise(() => getOrganizations(token)),
    orgs => orgs.organizations
  ).render((orgs) => (
    <BreadcrumbLayout breadcrumbs={['Specs', 'Organizations']}>
      <Row gutter={16}>
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
              dataSource={orgs}
              renderItem={(org: OrganizationWithAggregate) => (
                <List.Item
                  key={org.org.name}
                  actions={[
                    <Link to={`/organizations/${org.org.id}/courses`}><IconText type="book" text={org.aggregates.coursesCount.toString()} /></Link>,
                    <Link to={`/organizations/${org.org.id}/users`}><IconText type="user" text={org.aggregates.usersCount.toString()} /></Link>
                  ]}
                  extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
                >
                  <List.Item.Meta
                    title={<Link to={`/organizations/${org.org.id}/courses`}><IconText text={org.org.name} type="global" /></Link>}
                    description={<a href={org.org.url}>{org.org.url}</a>}
                  />
                  <div>{org.org.description}</div>
                  <div>{org.org.guid}</div>
                  <div>{org.org.contactEmail}</div>
                  <div>
                    <Link to={`/organizations/edit/${org.org.id}`}>edit</Link>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </BreadcrumbLayout>
  ))

export default Organizations;