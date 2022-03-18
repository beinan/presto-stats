import React, { Fragment } from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';

function Footer() {
  return (
    <Fragment>
      <div className="app-footer text-black-50">
        <div className="app-footer--first">
        </div>
        <div className="app-footer--second">
          Alluxio © 2022 Presto 查询日志可视化工具
        </div>
      </div>
    </Fragment>
  );
}

export default Footer;
