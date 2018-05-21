import React from 'react';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { Link, Route } from 'react-router-dom';

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
// #1890ff

const LayoutOut = ({ children }) => (
  <div>
    <Route exact path="/(|organizations/new|organizations/edit/:id|apps|apps/register)" component={SpecsLayout}/>
    <Route exact path="/organizations/:orgId/*" component={OrganizationLayout}/>
  </div>
);



export default LayoutOut;
