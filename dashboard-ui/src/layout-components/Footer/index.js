import React, { Fragment } from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';

function Footer() {
  return (
    <Fragment>
      <div className="app-footer text-black-50">
        <div className="app-footer--first">
          <Nav>
            <NavItem>
              <NavLink
                href="https://uifort.com/template/bamburgh-react-admin-dashboard-reactstrap-free"
                className="rounded-sm"
                target="_blank">
                Download now
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="https://uifort.com/template/bamburgh-react-admin-dashboard-reactstrap-pro"
                className="rounded-sm"
                target="_blank">
                View PRO Version
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <div className="app-footer--second">
          <span>Bamburgh React Admin Dashboard with Reactstrap Free</span> ©
          2020 - crafted with <span className="text-danger px-1">❤</span> by{' '}
          <a href="https://uifort.com" target="_blank" title="UiFort.com">
            UiFort.com
          </a>
        </div>
      </div>
    </Fragment>
  );
}

export default Footer;
