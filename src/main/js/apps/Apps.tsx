import React from 'react';

import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Apps = () => (
  <div>
    <Link to='/apps/register' className='ant-btn ant-btn-primary'>Register your app</Link>
  </div>
);

export default Apps;
