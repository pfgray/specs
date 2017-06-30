import React from 'react';
import { Link } from 'react-router';

import './header.less';
import icon from './specs_tex.png';
import { Button } from 'reactstrap';

const Header = ({children}) => (
  <div>
    <div className="header-container">
      <div className="container">
        <nav className="specs-nav">
          <a className="brand" href="#"><img src={icon} /></a>
          <ul>
            <li><Link to="/" activeClassName="active">Launches</Link></li>
            <li><Link to="/registration" activeClassName="active">Registration</Link></li>
            <li><Link to="/commander" activeClassName="active">Commander</Link></li>
          </ul>
          <div><Link to="/login" role="button" className="btn btn-warning">Sign up/in</Link></div>
        </nav>
      </div>
    </div>

    <div className="container main-container">
      {children}
    </div>
  </div>
);



export default Header;
