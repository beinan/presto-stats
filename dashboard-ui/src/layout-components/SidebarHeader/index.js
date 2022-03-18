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
              to="/"
              title="Presto Stats Visualizer">
              <i>
                <img
                  alt="Presto Stats Visualizer"
                  src={projectLogo}
                />
              </i>
              <span>Presto Stats</span>
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SidebarHeader;
