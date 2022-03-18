import React, { Fragment, Component } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';

import RouterLink from '../ReactMetismenuRouterLink';

import MetisMenu from 'react-metismenu';

const sidebarMenuContent = [
  {
    label: 'Projects',
    icon: 'pe-7s-safe',
    content: [
      {
        label: 'Seagate',
        description:
          'This is a dashboard page example built using this template.',
        to: '/projects/seagate2'
      }
    ]
  }
];

class SidebarMenu extends Component {
  render() {
    return (
      <Fragment>
        <PerfectScrollbar>
          <div className="sidebar-navigation">
            {/*
            <div className="sidebar-header">
              <span>Navigation menu</span>
            </div>
            */}
            <MetisMenu
              content={sidebarMenuContent}
              LinkComponent={RouterLink}
              activeLinkFromLocation
              iconNamePrefix=""
              noBuiltInClassNames={true}
              classNameItemActive="active"
              classNameIcon="sidebar-icon"
              iconNameStateVisible="sidebar-icon-indicator"
              iconNameStateHidden="sidebar-icon-indicator"
              classNameItemHasVisibleChild="submenu-open"
              classNameItemHasActiveChild="active"
              classNameStateIcon="pe-7s-angle-down"
            />
          </div>
        </PerfectScrollbar>
      </Fragment>
    );
  }
}

export default SidebarMenu;
