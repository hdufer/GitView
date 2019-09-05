import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from "react-router-dom";
import Home from './View/Home/Home'
import ReposDashboard from './View/ReposDashboard/ReposDashboard';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home}/>
      <Route exact path="/reposdashboard" component={ReposDashboard}/>
    </Router>
  );
}

export default App;
