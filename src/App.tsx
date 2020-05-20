import React from 'react';
import { DateTime } from "luxon";

import { TreeDemoView } from './TreeDemoView';
import { AwakeRightNowEstimation } from './AwakeRightNowEstimation';

import './App.css';

function App() {
  return (
    <div className="App">
      { TreeDemoView() }
      { AwakeRightNowEstimation() }
    </div>
  );
}

export default App;
