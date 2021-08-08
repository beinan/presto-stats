import React, { Fragment, Component } from 'react';

import { Link } from 'react-router-dom';

import projectLogo from '../../assets/images/react.svg';

class SidebarHeader extends Component {
  render() {
    return (
      <Fragment>
        <div className="app-sidebar--header">
          <div className="nav-logo">
            <Link
              to="/DashboardDefault"
              title="Bamburgh React Admin Dashboard with Reactstrap Free">
              <i>
                <img
                  alt="Bamburgh React Admin Dashboard with Reactstrap Free"
                  src={projectLogo}
                />
              </i>
              <span>Bamburgh</span>
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SidebarHeader;
