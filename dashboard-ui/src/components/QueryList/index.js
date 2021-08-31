import React, { Fragment, useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { addActiveBatch, removeActiveBatch } from '../../reducers/ActiveBatches';

import { connect } from 'react-redux';

import clsx from 'clsx';

import {
  Table,
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


function mapStateToProps(state) {
  const { active_batches } = state.ActiveBatches;
  console.log("mapStateToProps for bache compare", state)
  return { active_batches: active_batches }
}

export default connect(mapStateToProps, { addActiveBatch, removeActiveBatch })(QueryList)

function QueryList(props) {
  const { queryList } = props
  const queryItems = queryList.map((query, index) => <QueryItem query={query} key={index}/>)
  return (
    <Fragment>
      {queryItems}
    </Fragment>
  )
}


function QueryItem(props) {
  const { query } = props
  return (
    <Fragment>
      {query.jsonStats.sql}
    </Fragment>
  )
}

const color_class_list = ['info', 'danger']



