import React, { Fragment } from 'react';

import {
    useParams
  } from "react-router-dom";

import {
    useQuery,
    gql
} from "@apollo/client";

import { PageTitle } from '../../layout-components';
import BatchList from 'components/BatchList';
import BatchComparison from 'components/BatchComparison';

const GQL_PROJECT = gql`
  query Project($projectId:ID!){
    project(id:$projectId) {
      id
      batches {
        id, 
        queries {
          id
          jsonStats{
            sql,
            queryStats
          }   
        }
      }
    }
  }
`;

export default function ProjectPage() {
  let { projectId } = useParams();
  console.log("Opening project", projectId)
  const { loading, error, data } = useQuery(GQL_PROJECT, {
    variables: { projectId },
  });
  console.log(error, data)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error}</p>;

  return (
    <Fragment>
      <PageTitle
        titleHeading={"Project -- " + projectId}
        titleDescription="This is a dashboard page example built using this template."
      />

    <BatchList batches={data.project.batches}/>
    <BatchComparison projectId={projectId}/>
    </Fragment>
  );
}
