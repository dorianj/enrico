import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { TreeDemoView } from './TreeDemoView';
import { AwakeRightNowEstimation } from './AwakeRightNowEstimation';

import './App.css';

export default function App() {
  return (
    <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tree_test">Tree test</Link>
          </li>
          <li>
            <Link to="/awake_test">Awake test</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/tree_test">
          <TreeDemoView />
        </Route>
        <Route path="/awake_test">
          <AwakeRightNowEstimation />
        </Route>
        <Route path="/">
          Hello
        </Route>
      </Switch>
    </div>
  </Router>
  );
}
