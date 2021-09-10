import React, { Fragment, useState, useEffect} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { addActiveBatch, removeActiveBatch } from '../../reducers/ActiveBatches';

import { connect } from 'react-redux';

import {
  Table,
  CardBody,
  Card,
  CustomInput,
  Badge,
  Label,
  Input,
  UncontrolledTooltip,
  Button,
  Progress
} from 'reactstrap';

const BatchItem = connect(null, { addActiveBatch, removeActiveBatch })(BatchItemRender)

function BatchItemRender(props) {
    let {index, batch} = props
    const [isActive, setActive] = useState(true);
    useEffect(() =>  {
      if(isActive) {
        props.addActiveBatch(batch)
      } else {
        props.removeActiveBatch(batch)
      }
    });
    return (
        <tr>
            <td>{index}</td>
            <td>
            <div>
                <a
                href="#/"
                onClick={e => e.preventDefault()}
                className="font-weight-bold text-black"
                title="...">
                {batch.id}
                </a>
                <span className="text-black-50 d-block">
                
                </span>
            </div>
            </td>
            <td className="text-center">
            <Badge
                color="neutral-success"
                className="text-success px-4">
                Completed
            </Badge>
            </td>
            <td>
            <Progress
                value="100"
                className="progress-bar-rounded"
                color="info">
                {batch.queries.length}
            </Progress>
            </td>
            <td className="text-center">
            <Label check>
              <Input type="checkbox" id={"checkbox_" + index} checked={isActive}
                onChange={(e) => setActive(e.target.checked)}/>{' '}
              Check me out
            </Label>
            {/* <CustomInput
                className="mb-3"
                type="checkbox"
                id={"check-batch-" + index}
                label="Check this to compare"
                value={isActive}
                onClick={(e) => setActive(e.target.value)}
                />*/}
            </td> 
        </tr>
    )
}

export default function BatchList(props) {
  let {batches, projectId} = props;
  let batchItems = batches.map ((batch, index) => <BatchItem batch={batch} index={index+1}/>)
  return (
    <Fragment>
      <Card className="card-box mb-5">
        <div className="card-header pr-2">
          <div className="card-header--title">Batch List</div>
          <div className="card-header--actions">
            <Button
              tag="a"
              href="#/"
              onClick={e => e.preventDefault()}
              size="sm"
              color="link"
              className="text-primary"
              id="RefreshTooltip1">
              <FontAwesomeIcon icon={['fas', 'cog']} spin />
            </Button>
            <UncontrolledTooltip target="RefreshTooltip1">
              Refresh
            </UncontrolledTooltip>
          </div>
        </div>
        <CardBody>
          <div className="table-responsive-md">
            <Table hover borderless className="text-nowrap mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="text-left">Name</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Progress</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batchItems}
              </tbody>
            </Table>
          </div>
        </CardBody>
        <div className="card-footer d-flex justify-content-between">
          <Button outline color="danger" size="sm">
            Delete
          </Button>
          <div>
            <Button size="sm" color="link" className="btn-link-primary">
              View all
            </Button>
            <Button size="sm" color="primary">
              Add new entry
            </Button>
          </div>
        </div>
      </Card>
    </Fragment>
  );
}
