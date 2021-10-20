import React, { Fragment, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  addActiveBatch,
  removeActiveBatch
} from '../../reducers/ActiveBatches';

import { connect } from 'react-redux';

import clsx from 'clsx';

import {
  CardBody,
  Card,
  Row,
  Col,
  UncontrolledTooltip,
  Button,
  Progress,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent
} from 'reactstrap';
import BatchDetail from 'components/BatchDetail';
import ChartList from 'components/ChartList';
import StatsTable from 'components/StatsTable';

function mapStateToProps(state) {
  const { active_batches } = state.ActiveBatches;
  console.log('mapStateToProps for batch compare', state);
  return { active_batches };
}

export default connect(mapStateToProps, { addActiveBatch, removeActiveBatch })(
  BatchComparison
);

function BatchComparison(props) {
  let { active_batches, projectId } = props;
  console.log('batch compare', active_batches);
  if (!active_batches) return <p />;
  return (
    <Fragment>
      <SummaryCard active_batches={active_batches} />
      <BatchTabs active_batches={active_batches} projectId={projectId} />
      <ChartList />
      <StatsTable />
      {/* <GroupBySqlCard active_batches={active_batches} /> */}
    </Fragment>
  );
}

const color_class_list = ['info', 'danger'];

function BatchTabs(props) {
  const { active_batches, projectId } = props;
  const [activeTabId, setActive] = useState(0);

  const nav_items = active_batches.map((batch, index) => (
    <NavItem>
      <NavLink
        className={clsx({ active: activeTabId === index })}
        onClick={() => {
          setActive(index);
        }}>
        {batch.id}
      </NavLink>
    </NavItem>
  ));
  const tab_items = active_batches.map((batch, index) => (
    <TabPane tabId={index}>
      <p className="mb-0 p-3">
        <BatchDetail batchId={batch.id} projectId={projectId} />
      </p>
    </TabPane>
  ));
  return (
    <Fragment>
      <Nav tabs>{nav_items}</Nav>
      <TabContent className="mb-5" activeTab={activeTabId}>
        {tab_items}
      </TabContent>
    </Fragment>
  );
}

function GroupBySqlCard(props) {
  let { active_batches } = props;
  let sql_map = new Map();
  active_batches.forEach((batch, batch_index) => {
    batch.queries.forEach(query => {
      let sql = query.jsonStats.sql;
      if (sql_map.has(sql)) {
        if (sql_map.get(sql)[batch_index]) {
          sql_map.get(sql)[batch_index].push(query);
        } else {
          sql_map.get(sql)[batch_index] = [query];
        }
      } else {
        let sql_list = [];
        sql_list[batch_index] = [query];
        sql_map.set(sql, sql_list);
      }
    });
  });
  console.log('sql map', sql_map);
  let sql_list = [];
  for (const [sql, query_grouped_by_batch] of sql_map) {
    const cols = query_grouped_by_batch.map((query_list, batch_index) => {
      return (
        <Col
          lg="6"
          className="p-3"
          key={'query_grouped_by_batch' + batch_index}>
          {query_list.map(sql => (
            <p>{sql.jsonStats.sql.substring(0, 100)}</p>
          ))}
        </Col>
      );
    });
    sql_list.push(<Row className="no-gutters">{cols}</Row>);
  }
  return (
    <Card className="card-box mb-5">
      <div className="px-4 px-xl-5 pb-1">
        <div className="card-header d-block">
          <span className="text-uppercase py-3 py-xl-4 text-black d-block text-center font-weight-bold font-size-lg">
            Group By Unique SQLs
          </span>
        </div>
        <CardBody className="p-0">
          <div className="grid-menu grid-menu-2col">{sql_list}</div>
        </CardBody>
      </div>
    </Card>
  );
}

function SummaryCard(props) {
  let { active_batches } = props;
  let batch_icons = active_batches.map((batch, index) => {
    return (
      <Col lg="6" className="p-3" key={batch.id}>
        <div className="text-center">
          <FontAwesomeIcon
            icon={['fas', 'lemon']}
            className={
              'font-size-xxl text-' + color_class_list[index] + ' my-3'
            }
          />
          <span className="text-black-50 d-block">{batch.id}</span>
          <b className="font-size-xxl">{batch.queries.length}</b>
        </div>
      </Col>
    );
  });
  return (
    <Card className="card-box mb-5">
      <div className="px-4 px-xl-5 pb-1">
        <div className="card-header d-block">
          <span className="text-uppercase py-3 py-xl-4 text-black d-block text-center font-weight-bold font-size-lg">
            Summary
          </span>
        </div>
        <CardBody className="p-0">
          <div className="grid-menu grid-menu-2col">
            <Row className="no-gutters">{batch_icons}</Row>
          </div>
        </CardBody>
        <div className="card-header border-0 d-block">
          <span className="text-uppercase pt-4 pb-2 text-black d-block text-center font-weight-bold font-size-lg">
            Activity
          </span>
        </div>
        <div className="py-2">
          <div className="align-box-row">
            <div className="flex-grow-1">
              <Progress
                value="43"
                color="success"
                className="progress-bar-rounded">
                {' '}
                43%
              </Progress>
            </div>
            <div className="line-height-sm text-center ml-4">
              <b className="font-size-lg text-success">
                <small className="text-black-50 pr-1">$</small>
                1,754
              </b>
            </div>
          </div>
        </div>
        <div className="py-2">
          <div className="align-box-row">
            <div className="flex-grow-1">
              <Progress
                value="61"
                color="info"
                className="progress-bar-rounded">
                61%
              </Progress>
            </div>
            <div className="line-height-sm text-center ml-4">
              <b className="font-size-lg text-info">
                <small className="text-black-50 pr-1">$</small>
                7,428
              </b>
            </div>
          </div>
        </div>
        <div className="py-2">
          <div className="align-box-row">
            <div className="flex-grow-1">
              <Progress
                value="22"
                color="danger"
                className="progress-bar-rounded">
                22%
              </Progress>
            </div>
            <div className="line-height-sm text-center ml-4">
              <b className="font-size-lg text-danger">
                <small className="text-black-50">$</small>
                5,358
              </b>
            </div>
          </div>
        </div>
        <div className="card-header border-0 d-block">
          <span className="text-uppercase pb-1 pt-1 text-black d-block text-center font-weight-bold font-size-lg">
            Charts
          </span>
        </div>
      </div>
      <div className="card-footer d-block text-center">
        <Button
          tag="a"
          href="#/"
          onClick={e => e.preventDefault()}
          size="sm"
          color="success"
          id="RefreshTooltip1574">
          <FontAwesomeIcon icon={['fas', 'cog']} spin />
        </Button>
        <UncontrolledTooltip target="RefreshTooltip1574">
          Refresh
        </UncontrolledTooltip>
      </div>
    </Card>
  );
}
