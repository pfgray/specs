import React from 'react';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { Link, Route, Switch } from 'react-router-dom';

import Organizations from '../organizations/Organizations.tsx';
import OrganizationForm from '../organizations/OrganizationForm.tsx';
import Courses from '../courses/Courses.tsx';
import CoursesForm from '../courses/CoursesForm.tsx';
import Users from '../users/Users.tsx';
import UsersForm from '../users/UsersForm.tsx';

import Enrollments from '../enrollments/Enrollments.tsx';
import EnrollmentForm from '../enrollments/EnrollmentForm.tsx';

import SpecsLayout from './SpecsLayout.tsx';
import OrganizationLayout from './OrganizationLayout.tsx';

const LayoutOut = ({ children }) => (
  <div>
    <Switch>
      <Route path="/(|organizations|organizations/new|organizations/edit/*|apps|apps/register|launch|apps/*/manage)" component={SpecsLayout} />
      <Route path="/organizations/:orgId/*" component={OrganizationLayout} />
    </Switch>
  </div>
);



export default LayoutOut;
