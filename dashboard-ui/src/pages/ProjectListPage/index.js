import React, { Fragment } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

import { PageTitle } from '../../layout-components';

import ProjectPage from '../ProjectPage';

export default function ProjectListPage() {
  let { path, url } = useRouteMatch();
  console.log("Opening project list page:", path)
  return (
    <Fragment>
      <PageTitle
        titleHeading={"Project List "}
        titleDescription="This is a dashboard page example built using this template."
      />
      <Switch>
        <Route exact path={path}>
          <h3>Please select a topic.</h3>
        </Route>
        <Route path={`${path}/:projectId`}>
          <ProjectPage />
        </Route>
      </Switch>
    </Fragment>
  );
}
