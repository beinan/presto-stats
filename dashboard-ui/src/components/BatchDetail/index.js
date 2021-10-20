import React, { Fragment } from 'react';

import { useQuery, gql } from '@apollo/client';
import QueryList from 'components/QueryList';

const GQL_BATCH = gql`
  query Project($projectId: ID!, $batchId: ID!) {
    batch(id: $batchId, projectId: $projectId) {
      queries {
        id
        jsonStats {
          sql
          queryStats
          stages {
            stage_id
            totalDrivers
            totalCpuTime
            avgCpuTime
            totalBlockedTime
            avgBlockedTime
            totalTasks
            tasks {
              task_id
              createTime
              endTime
              elapsedTime
              totalDrivers
              totalCpuTime
              avgCpuTime
              totalBlockedTime
              avgBlockedTime
              totalPipelines
              pipelines {
                ppl_id
                firstStartTime
                lastEndTime
                totalDrivers
                totalCpuTime
                avgCpuTime
                totalBlockedTime
                avgBlockedTime
                totalOperators
                operators {
                  op_id
                  operatorType
                  totalDrivers
                  addInputWall
                  getOutputWall
                  finishWall
                  avgWall
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default function BatchDetail(props) {
  let { projectId, batchId } = props;
  const { loading, error, data } = useQuery(GQL_BATCH, {
    variables: { projectId, batchId }
  });
  console.log('batch detail loading', projectId, batchId, data);
  if (loading) {
    return <p>Loading</p>;
  }
  if (error) {
    console.log('gql batch detail error', error);
    return <p>Error</p>;
  }

  return (
    <Fragment>
      <QueryList queryList={data.batch.queries} />
    </Fragment>
  );
}

const color_class_list = ['info', 'danger'];
