import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

import { Link } from "react-router-dom";

import {
  useQuery,
  gql
} from "@apollo/client";

import { PageTitle } from '../../layout-components';

const GQL_PROJECT_LIST = gql`
  query Projects{
    projects {
      id
      batches {
        id
        queries {
          id
        }
      }
    }
  }
`;

const color_class_list = ['info', 'danger', 'primary', 'success', 'warning']
function ProjectCard(props) {
  const { project } = props
  const batch_icons = project.batches.map((batch, index) => (
    <Col lg="6" className="p-3" key={batch.id}>
      <div className="text-center">
        <FontAwesomeIcon
          icon={['fas', 'lemon']}
          className={"font-size-xxl text-" + color_class_list[index % color_class_list.length] + " my-3"}
        />
        <span className="text-black-50 d-block">{batch.id}</span>
        <b className="font-size-xxl">{batch.queries.length}</b>
      </div>
    </Col>
  ))
  return (
    <Card className="card-box mb-5">
      <div className="px-4 px-xl-5 pb-1">
        <div className="card-header d-block">
          <span className="text-uppercase py-3 py-xl-4 text-black d-block text-center font-weight-bold font-size-lg">
            {project.id}
          </span>
        </div>
        <CardBody className="p-0">
          <div className="grid-menu grid-menu-2col">
            <Row className="no-gutters">
              {batch_icons}
            </Row>
          </div>
        </CardBody>
        <div className="text-center py-4">
          <Link to={"/project/" + project.id}>
            <Button  size="sm" color="primary" >
              <span className="btn-wrapper--icon">
                <FontAwesomeIcon icon={['far', 'eye']} />
              </span>
              <span className="btn-wrapper--label">Generate reports</span>
              </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default function ProjectListPage() {
  const { loading, error, data } = useQuery(GQL_PROJECT_LIST);
  console.log("projectListPage", loading, error, data)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const projectCardList = data.projects.map((project, index) => <ProjectCard project={project} key={index} />)
  return (
    <Fragment>
      <PageTitle
        titleHeading={"Project List "}
        titleDescription=""
      />
      {projectCardList}
    </Fragment>
  );
}
