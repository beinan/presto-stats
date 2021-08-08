import React, { Fragment } from 'react';

import {
    useParams
  } from "react-router-dom";

import {
    useQuery,
    gql
} from "@apollo/client";

import { PageTitle } from '../../layout-components';

const GQL_PROJECT = gql`
  query {
    project(id:"seagate2") {
      id
      batches {id, text}
    }
  }
`;

export default function ProjectPage() {
  let { projectId } = useParams();
  console.log("Opening project", projectId)
  const { loading, error, data } = useQuery(GQL_PROJECT);
  console.log(error, data)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <Fragment>
      <PageTitle
        titleHeading={"Project -- " + projectId}
        titleDescription="This is a dashboard page example built using this template."
      />


    </Fragment>
  );
}
