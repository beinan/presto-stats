import React, { Fragment, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { addActiveBatch, removeActiveBatch } from '../../reducers/ActiveBatches';
import { addActiveQuery, removeActiveQuery } from '../../reducers/ActiveQueries';

import { connect } from 'react-redux';

import clsx from 'clsx';

import {
  Alert,
  Table,
  CardBody,
  Card,
  Row,
  Col,
  Label,
  Input,
  UncontrolledTooltip,
  Button,
  Progress,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent
} from 'reactstrap';

import PerfectScrollbar from 'react-perfect-scrollbar';


const color_class_list = ['dark', 'info', 'danger', 'primary', 'success', 'warning']

function mapStateToProps(state) {
  const { active_batches } = state.ActiveBatches;
  const { active_queries } = state.ActiveQueries;
  console.log("mapStateToProps for query item compare", state, { active_batches, active_queries })
  return { active_batches, active_queries }
}

export default function QueryList(props) {
  const { queryList } = props
  const queryItems = queryList.map((query, index) => <QueryItem query={query} key={index} />)
  return (
    <Fragment>
      {queryItems}
    </Fragment>
  )
}


const QueryItem = connect(mapStateToProps, { addActiveQuery, removeActiveQuery})(QueryItemRender)
function QueryItemRender(props) {
  const { key, query } = props
  const [isActive, setActive] = useState(false);

  const active_query_index = props.active_queries.indexOf(query)
  const active_query_color = color_class_list[active_query_index + 1]
  let checkbox_message = "Check out this query"
  if(active_query_index > -1) {
    checkbox_message = "Active Query #" + (active_query_index + 1)
  }

  console.log("query", query)
  const { endTime, executionTime, planningTime, physicalInputDataSize, totalCpuTime} = query.jsonStats.queryStats;

  const checkboxOnChange = (e) => {
    setActive(e.target.checked)
    if(e.target.checked) {
      props.addActiveQuery(query)
    } else {
      props.removeActiveQuery(query)
    }
  }
  return (
    <Fragment>
      <Card className="p-4 mb-5">
        <Row className="d-flex align-items-center">
          <CardBody>
            <Alert color={active_query_color}>
              <PerfectScrollbar style={{ height: 40, paddingTop: 2, fontSize:10 }}>
                <p>{query.jsonStats.sql}</p>
              </PerfectScrollbar>
            </Alert>
          </CardBody>
          <div className="text-black-50 pb-3"></div>
          <Col xl="9">
            <div className="text-black-50 pb-3">
              <Label check>
                <Input type="checkbox" id={"checkbox_" + key} checked={isActive}
                  onChange={checkboxOnChange} />{' '}
                  {query.id} -- {checkbox_message}
              </Label>
            </div>
            <div className="d-flex justify-content-center">
              <div>
                <div className="text-center font-size-lg px-5">
                  <span className="font-weight-bold">{executionTime}</span>
                  <small className="text-black-50 d-block">Execution Time</small>
                </div>
              </div>
              <div>
                <div className="text-center font-size-lg px-5">
                  <span className="font-weight-bold text-first">{planningTime}</span>
                  <small className="text-black-50 d-block">Planning Time</small>
                </div>
              </div>
              <div>
                <div className="text-center font-size-lg px-5">
                  <span className="font-weight-bold">{physicalInputDataSize}</span>
                  <small className="text-black-50 d-block">Physical Read</small>
                </div>
              </div>
              <div>
                <div className="text-center font-size-lg px-5">
                  <span className="font-weight-bold">{totalCpuTime}</span>
                  <small className="text-black-50 d-block">Total CPU Time</small>
                </div>
              </div>
            </div>
          </Col>
          <Col xl="3">
            <div className="text-black-50 pb-3">Current progress</div>
            <Progress
              className="progress-animated-alt progress-bar-rounded"
              color="success"
              value="100">
              100%
            </Progress>
            <div className="align-box-row mt-1 text-muted">
              <div className="font-weight-bold">endTime</div>
              <div className="ml-auto">
                <div className="font-size-sm font-weight-bold text-success">
                  {endTime}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

    </Fragment>
  )
}





