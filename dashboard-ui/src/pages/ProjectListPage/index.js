import React, { Fragment, useState } from 'react';

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
  Modal,
  InputGroupText,
  Input,
  FormGroup
} from 'reactstrap';

import { Link } from "react-router-dom";

import {
  useMutation,
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

const GQL_NEW_PROJECT = gql`
  mutation NewProject($newProject:NewProject){
    newProject(input: $newProject) {
      id
      batches {id}
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
            <Button size="sm" color="primary" className="m-2" >
              <span className="btn-wrapper--icon">
                <FontAwesomeIcon icon={['far', 'eye']} />
              </span>
              <span className="btn-wrapper--label">生成报告</span>
            </Button>
          </Link>
          {/*
          <Button size="sm" color="success" id="AddNewBatchTip" className="m-2">
            <span className="btn-wrapper--icon">
              <FontAwesomeIcon
                icon={['fas', 'plus']}
                className="opacity-8 font-size-xs"
              />
            </span>
          </Button>
          <UncontrolledTooltip target="AddNewBatchTip">
            Create a new batch
          </UncontrolledTooltip>
          */}
        </div>

      </div>
    </Card>
  )
}

function NewProjectModal(props) {
  const [projectId, setProjectId] = useState('');

  const [createProject, { loading, error, data } ] = useMutation(GQL_NEW_PROJECT, {
    refetchQueries: [
      'Projects' // Query name
    ],
  });
  
  console.log("new project modal", loading, error, data)
  let message = <p></p>
  if (loading) message = <p>Loading...</p>;
  if (error) message = <p>{"Error:" + error.message}</p>;

  if (data) {
    message = <p>Project created</p>;
  }

  return (
    <Modal zIndex={2000} centered isOpen={props.isOpen} toggle={props.toggle}>
      <div>
        <Card className="bg-secondary shadow-none border-0">
          <div className="card-body px-lg-5 py-lg-5">
            <div className="text-center mb-4">
              <small>Add new project</small>
              {message}
            </div>
            <form>
              <div className="form-group mb-3">
                <div className="input-group input-group-alternative">
                  <div className="input-group-prepend">
                    <InputGroupText>
                      <FontAwesomeIcon icon={['far', 'folder']} />
                    </InputGroupText>
                  </div>
                  <Input placeholder="Project Name" type="text" value={projectId} onInput={e => setProjectId(e.target.value)}/>
                </div>
              </div>
              <div className="text-center">
                <Button color="second" className="mt-4" onClick={() => {
                  createProject({variables:{newProject:{id:projectId}}});
                  }}>
                  Create
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </Modal>
  )
}

export default function ProjectListPage() {
  const { loading, error, data } = useQuery(GQL_PROJECT_LIST);
  const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const toggleNewProjectModal = () => setNewProjectModalOpen(!isNewProjectModalOpen);

  console.log("projectListPage", loading, error, data)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  const projectCardList = data.projects.map((project, index) => <ProjectCard project={project} key={index} />)
  return (
    <Fragment>
      <PageTitle
        titleHeading={"项目列表"}
        titleDescription=""
      >
        {/*
        <div className="d-flex align-items-center mt-3 mt-lg-0">
          <Button size="sm" color="success" id="AddNewProjectTip" onClick={toggleNewProjectModal}>
            <span className="btn-wrapper--icon">
              <FontAwesomeIcon
                icon={['fas', 'plus']}
                className="opacity-8 font-size-xs"
              />
            </span>
          </Button>
          <UncontrolledTooltip target="AddNewProjectTip">
            Create a new project
          </UncontrolledTooltip>
          <NewProjectModal isOpen={isNewProjectModalOpen} toggle={toggleNewProjectModal}/>
        </div>
        */}
      </PageTitle>
      {projectCardList}
    </Fragment>
  );
}
