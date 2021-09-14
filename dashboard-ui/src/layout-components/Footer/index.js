import React, { Fragment } from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';

function Footer() {
  return (
    <Fragment>
      <div className="app-footer text-black-50">
        <div className="app-footer--first">
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
