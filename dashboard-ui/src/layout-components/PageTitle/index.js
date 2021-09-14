import React, { Fragment, Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { UncontrolledTooltip, Button } from 'reactstrap';

class PageTitle extends Component {
  render() {
    return (
      <Fragment>
        <div className="app-page-title">
          <div>
            <div className="app-page-title--first">
              <div className="app-page-title--heading">
                <h1>{this.props.titleHeading}</h1>
                <div className="app-page-title--description">
                  {this.props.titleDescription}
                </div>
              </div>
            </div>
          </div>
          {this.props.children}
        </div>
      </Fragment>
    );
  }
}

export default PageTitle;
