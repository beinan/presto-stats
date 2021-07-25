import logo from './logo.svg';
import './App.css';

import {
  useQuery,
  gql
} from "@apollo/client";

import { Button } from 'reactstrap';

const GQL_PROJECT = gql`
  query {
    project(id:"seagate2") {
      id
      batches {id, text}
    }
  }
`;

function ProjectView() {
  const { loading, error, data } = useQuery(GQL_PROJECT);
  console.log(error, data)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return data.project.batches.map(({ id, text }) => (
    <div key={id}> 
      <p>
        {text}
      </p>
    </div>
  ));
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Button color="danger">Danger!</Button>
        <ProjectView/>
      </header>
    </div>
  );
}

export default App;
