import React, { Fragment, useState } from 'react';

import {
  addActiveQuery,
  removeActiveQuery
} from '../../reducers/ActiveQueries';

import { connect } from 'react-redux';

import parse from 'parse-duration';
import convert from 'convert-units';

import {
  CardHeader,
  CardBody,
  Card,
  Row,
  Col,
  Label,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap';

import Chart from 'react-apexcharts';

const color_class_list = [
  'dark',
  'info',
  'danger',
  'primary',
  'success',
  'warning'
];

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
  ChartList
);

function parseStrData(str_data) {
  if (typeof str_data != 'string') {
    return str_data;
  }
  console.log('parse str data', str_data, typeof str_data);
  if (str_data.indexOf('B', str_data.length - 1) !== -1) {
    //console.log("convert", str_data, convert(str_data.substr(0, str_data.length - 1)).from('B').to('GB').toFixed(2))
    return convert(str_data.substr(0, str_data.length - 1))
      .from('B')
      .to('GB')
      .toFixed(2);
  } else {
    //console.log("convert", str_data, convert(parse(str_data)).from('ms').to('s').toFixed(2))
    //time duration
    return convert(parse(str_data))
      .from('ms')
      .to('s')
      .toFixed(2);
  }
}

//extract json data from query_stats
function extractQueryStats(active_queries, properties) {
  const options = {
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: properties
    }
  };

  if (active_queries.length == 0) {
    return { options: options, series: [], prop_list: [] };
  }
  const series = active_queries.map((query, index) => {
    const name = ' Query #' + (index + 1) + ' ' + query.id;
    const data = properties.map(prop =>
      parseStrData(query.jsonStats.queryStats[prop])
    );

    return { name, data };
  });

  //list all the props in the queryStats object
  const prop_list = Object.keys(active_queries[0].jsonStats.queryStats);

  return { options, series, prop_list };
}

//extract json data from operatorSummary
function extractOperatorSummary(active_queries, selected_props) {
  let data_map = {};
  active_queries.forEach((query, index) => {
    query.jsonStats.queryStats.operatorSummaries.forEach(summary => {
      const key = summary.operatorType;
      if (!data_map[key]) {
        data_map[key] = [];
      }
      if (!data_map[key][index]) {
        data_map[key][index] = 0;
      }
      data_map[key][index] += parseStrData(summary[selected_props]);
    });
  });
  const series = Object.keys(data_map).map(prop => {
    return { name: prop, data: data_map[prop] };
  });
  const query_titles = active_queries.map(
    (query, index) => 'Query #' + (index + 1) + ' ' + query.id
  );
  const options = {
    chart: {
      type: 'bar',
      stacked: true
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: query_titles
    },
    yaxis: {
      title: {
        text: undefined
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    }
  };
  if (active_queries.length == 0) {
    return { options: options, series: series, prop_list: [] };
  }

  //list all the props in the queryStats object
  const prop_list = Object.keys(
    active_queries[0].jsonStats.queryStats.operatorSummaries[0]
  );

  return { options, series, prop_list };
}

function ChartList(props) {
  const { active_queries } = props;
  return (
    <Fragment>
      <Row>
        <Col xl="6">
          <QueryStatsChartWrapper
            sectionHeading="Wall time (Second)"
            active_queries={active_queries}
            extractor={extractQueryStats}
            default_props={[
              'executionTime',
              'planningTime',
              'queuedTime',
              'elapsedTime'
            ]}
            type="bar"
          />
          <QueryStatsChartWrapper
            sectionHeading="Tasks"
            active_queries={active_queries}
            extractor={extractQueryStats}
            type="bar"
            default_props={['totalTasks', 'runningTasks', 'completedTasks']}
          />
          <QueryStatsChartWrapper
            sectionHeading="Data Size(GB)"
            active_queries={active_queries}
            extractor={extractQueryStats}
            type="bar"
            default_props={[
              'physicalInputDataSize',
              'rawInputDataSize',
              'processedInputDataSize',
              'outputDataSize'
            ]}
          />
        </Col>
        <Col xl="6">
          <QueryStatsChartWrapper
            sectionHeading="CPU Time(Second)"
            active_queries={active_queries}
            extractor={extractQueryStats}
            type="bar"
            default_props={[
              'totalCpuTime',
              'totalScheduledTime',
              'totalBlockedTime'
            ]}
          />
          <QueryStatsChartWrapper
            sectionHeading="Drivers"
            active_queries={active_queries}
            extractor={extractQueryStats}
            type="bar"
            default_props={[
              'totalDrivers',
              'completedDrivers',
              'blockedDrivers',
              'queuedDrivers'
            ]}
          />
          <QueryStatsChartWrapper
            sectionHeading="Memory (GB)"
            active_queries={active_queries}
            extractor={extractQueryStats}
            type="bar"
            default_props={[
              'peakTaskTotalMemory',
              'peakTotalMemoryReservation',
              'peakTaskRevocableMemory'
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col xl="12">
          <OperatorSummaryChartWraper
            active_queries={active_queries}
            default_prop="addInputWall"
          />
        </Col>
      </Row>
    </Fragment>
  );
}

function OperatorSummaryChartWraper(props) {
  const { active_queries, default_prop } = props;
  const [selected_props, set_selected_props] = useState(default_prop);

  const checkboxOnChange = (e, prop) => {
    if (e.target.checked) {
      set_selected_props(prop);
    } else {
      set_selected_props(default_prop);
    }
  };

  const { options, series, prop_list } = extractOperatorSummary(
    active_queries,
    selected_props
  );
  console.log('Operator Sumary', options, series, prop_list);
  const menu_items = prop_list.map(prop => (
    <div role="menuitem" key={'prop_menu' + prop} style={{ paddingLeft: 30 }}>
      <Label check>
        <Input
          type="checkbox"
          id={'checkbox_' + prop}
          checked={selected_props == prop}
          onChange={e => checkboxOnChange(e, prop)}
        />{' '}
        {prop}
      </Label>
    </div>
  ));

  return (
    <div>
      <Card className="card-box mb-5">
        <CardHeader>
          <div className="card-header--title font-size-md font-weight-bold py-2">
            Operator Summary
            <UncontrolledDropdown tag="span" className="m-2">
              <DropdownToggle size="sm" color="second" caret>
                Props
              </DropdownToggle>
              <DropdownMenu>{menu_items}</DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardHeader>
        <CardBody>
          <Chart options={options} series={series} type="bar" />
        </CardBody>
      </Card>
    </div>
  );
}
function QueryStatsChartWrapper(props) {
  const { active_queries, default_props } = props;
  const [selected_props, set_selected_props] = useState(default_props);

  const checkboxOnChange = (e, prop) => {
    if (e.target.checked) {
      set_selected_props([...selected_props, prop]);
    } else {
      set_selected_props(selected_props.filter(i => i !== prop));
    }
  };

  const { options, series, prop_list } = extractQueryStats(
    active_queries,
    selected_props
  );

  const menu_items = prop_list.map(prop => (
    <div role="menuitem" key={'prop_menu' + prop} style={{ paddingLeft: 30 }}>
      <Label check>
        <Input
          type="checkbox"
          id={'checkbox_' + prop}
          checked={selected_props.includes(prop)}
          onChange={e => checkboxOnChange(e, prop)}
        />{' '}
        {prop}
      </Label>
    </div>
  ));

  return (
    <Card className="card-box mb-5">
      <CardHeader>
        <div className="card-header--title font-size-md font-weight-bold py-2">
          {props.sectionHeading}
          <UncontrolledDropdown tag="span" className="m-2">
            <DropdownToggle size="sm" color="second" caret>
              Props
            </DropdownToggle>
            <DropdownMenu>{menu_items}</DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type={props.type} />
      </CardBody>
    </Card>
  );
}
