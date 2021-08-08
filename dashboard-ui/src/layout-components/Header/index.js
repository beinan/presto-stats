import React, { Fragment, Component } from 'react';

import clsx from 'clsx';

import { Button } from 'reactstrap';

import { connect } from 'react-redux';

import { setSidebarToggleMobile } from '../../reducers/ThemeOptions';

import HeaderUserbox from '../../layout-components/HeaderUserbox';

class Header extends Component {
  toggleSidebarMobile = () => {
    let { sidebarToggleMobile, setSidebarToggleMobile } = this.props;
    setSidebarToggleMobile(!sidebarToggleMobile);
  };

  render() {
    let { sidebarToggleMobile } = this.props;
    return (
      <Fragment>
        <div className="app-header">
          <div className="app-header--pane">
            <button
              className={clsx(
                'navbar-toggler hamburger hamburger--elastic toggle-mobile-sidebar-btn',
                { 'is-active': sidebarToggleMobile }
              )}
              onClick={this.toggleSidebarMobile}>
              <span className="hamburger-box">
                <span className="hamburger-inner" />
              </span>
            </button>
            <Button
              tag="a"
              href="https://uifort.com/template/bamburgh-react-admin-dashboard-reactstrap-free"
              target="_blank"
              size="sm"
              color="neutral-success"
              className="ml-3 mr-3 btn-transition-none">
              Download now
            </Button>
            <Button
              tag="a"
              href="https://uifort.com/template/bamburgh-react-admin-dashboard-reactstrap-pro"
              target="_blank"
              size="sm"
              color="neutral-warning"
              className="transition-none">
              View PRO Version
            </Button>
          </div>
          <div className="app-header--pane">
            <HeaderUserbox />
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  sidebarToggleMobile: state.ThemeOptions.sidebarToggleMobile
});

const mapDispatchToProps = dispatch => ({
  setSidebarToggleMobile: enable => dispatch(setSidebarToggleMobile(enable))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
