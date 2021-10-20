import React from 'react';

import {
  addActiveQuery,
  removeActiveQuery
} from '../../reducers/ActiveQueries';

import { connect } from 'react-redux';

import { Table } from 'reactstrap';

function mapStateToProps(state) {
  const { active_batches } = state.ActiveBatches;
  const { active_queries } = state.ActiveQueries;
  console.log('mapStateToProps for query item compare', state, {
    active_batches,
    active_queries
  });
  return { active_batches, active_queries };
}

export default connect(mapStateToProps, { addActiveQuery, removeActiveQuery })(
  StatsTable
);

function StageSumaryTable(props) {
  const stage_id = props.stage_id;
  const active_queries = props.active_queries;
  const columns = [
    'totalDrivers',
    'totalCpuTime',
    'avgCpuTime',
    'totalBlockedTime',
    'avgBlockedTime',
    'totalTasks'
  ];
  const column_names = columns.map(column => <th scope="col">{column}</th>);
  const queries_sumary = active_queries.map(query => (
    <tr>
      <th scope="row">{query.id}</th>
      {columns.map(column => {
        if (column == 'avgCpuTime' || column == 'avgBlockedTime')
          return (
            <td>{query.jsonStats.stages[stage_id][column].toFixed(2)}ms</td>
          );
        else return <td>{query.jsonStats.stages[stage_id][column]}</td>;
      })}
    </tr>
  ));
  return (
    <Table responsive size="sm" bordered>
      <thead>
        <tr>
          <th scope="col">query</th>
          {column_names}
        </tr>
      </thead>
      <tbody>{queries_sumary}</tbody>
    </Table>
  );
}

function StageOperatorsTable(props) {
  const stage_id = props.stage_id;
  const active_queries = props.active_queries;

  if (!active_queries || active_queries.length == 0) return <p />;
  const _ppls = active_queries[0].jsonStats.stages[stage_id].tasks[0].pipelines;
  const total_ppls = _ppls.length;
  let ppl_header = [];
  let operator_names = [];
  for (let i = 0; i < total_ppls; i++) {
    ppl_header.push(
      <th colSpan={_ppls[i].operators.length + 1}>PPL #{_ppls[i].ppl_id}</th>
    );
    operator_names.push(<th>totalDrivers</th>);
    for (let j = 0; j < _ppls[i].operators.length; j++) {
      operator_names.push(
        <th>
          {_ppls[i].operators[j].operatorType.substr(
            0,
            _ppls[i].operators[j].operatorType.length - 8
          )}
        </th>
      );
    }
  }

  let queries_operators = [];
  active_queries.forEach(query => {
    let _row = [];
    _row.push(<th>{query.id}</th>);
    let op_sumary = {};
    let ppl_total_drivers = {};
    query.jsonStats.stages[stage_id].tasks.forEach(task => {
      task.pipelines.forEach(ppl => {
        //sum up total drivers among all tasks
        if (!(ppl.ppl_id in ppl_total_drivers))
          ppl_total_drivers[ppl.ppl_id] = ppl.totalDrivers;
        else ppl_total_drivers[ppl.ppl_id] += ppl.totalDrivers;
        //sum up avgWall for each operator among all tasks
        ppl.operators.forEach(op => {
          if (!(op.operatorType in op_sumary))
            op_sumary[op.operatorType] = op.avgWall;
          else op_sumary[op.operatorType] += op.avgWall;
        });
      });
    });
    console.log('op_sumary = ', op_sumary);
    console.log('ppl total drivers = ', ppl_total_drivers);
    query.jsonStats.stages[stage_id].tasks[0].pipelines.forEach(ppl => {
      _row.push(<td>{ppl_total_drivers[ppl.ppl_id]}</td>);
      ppl.operators.forEach(op => {
        _row.push(
          <td>
            {(
              op_sumary[op.operatorType] /
              query.jsonStats.stages[stage_id].totalTasks
            ).toFixed(2)}
          </td>
        );
      });
    });
    queries_operators.push(<tr>{_row}</tr>);
  });
  return (
    <Table responsive size="sm" bordered>
      <thead>
        <tr>
          <th rowSpan="2">query</th>
          {ppl_header}
        </tr>
        <tr>{operator_names}</tr>
      </thead>
      <tbody>{queries_operators}</tbody>
    </Table>
  );
}

function StatsTable(props) {
  const { active_queries } = props;
  if (!active_queries || active_queries.length == 0) return <p />;

  const totalStages = active_queries[0].jsonStats.stages.length;
  let stageTables = [];
  for (let i = 0; i < totalStages; i++) {
    stageTables.push(
      <div>
        <p className="h1 text-center">STAGE {i}</p>
        <StageSumaryTable active_queries={active_queries} stage_id={i} />
        <StageOperatorsTable active_queries={active_queries} stage_id={i} />
      </div>
    );
  }

  return <div>{stageTables}</div>;
}
