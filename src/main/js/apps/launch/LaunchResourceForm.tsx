import * as React from 'react';

import { List, Icon, Row, Col, Button, Card, Select } from 'antd';
import { Users } from '../entities';
import { Entry, MessageTypes } from '../AppLaunch';

const Resource = ({ updateField, formState }) => (
  <Card>
    <h4>Resource</h4>
    <Entry attr="resource_link_id" formState={formState} />
    <Entry attr="resource_link_title" formState={formState} />
    <Entry attr="resource_link_description" formState={formState} />
  </Card>
);

export default Resource;
