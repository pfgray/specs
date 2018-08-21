import { Breadcrumb, Layout } from 'antd';
import * as React from 'react';

export type BreadcrumbLayoutProps = {
  breadcrumbs: string[],
  children: any
};

const BreadcrumbLayout = (props: BreadcrumbLayoutProps) => {
  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        {props.breadcrumbs.map(b => (
          <Breadcrumb.Item key={b}>{b}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
        {props.children}
      </Layout.Content>
    </Layout>
  );
};

export default BreadcrumbLayout;