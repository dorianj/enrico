import React from 'react';
import { DateTime } from "luxon";

import { Estimation, EstimationNode, EstimationOperation, ConstantEstimationNode } from './estimation';
import { PopulationByTimezone, Histogram, ScalarFact } from './facts';
import EstimationDisplay from './EstimationView';

import './App.css';

import { Computable } from './facts';
class DebugEstimationConstantNode extends EstimationNode {
  static readonly inputSlots = 0;

  constructor(private label_: string) {
    super([]);
  }

  get label(): string {
    return this.label_;
  }

  get output(): Computable {
    return new ScalarFact<number>(10);
  }
}

class DebugEstimationCombinatorNode extends EstimationNode {
  static readonly inputSlots = 0;

  constructor(inputs: EstimationNode[], private label_: string) {
    super(inputs);
  }

  get label(): string {
    return this.label_;
  }
  get output(): Computable {
    return new ScalarFact<number>(2);
  }
}

function SampleLargerEstimation(): JSX.Element {
  // Third
  const D = new DebugEstimationCombinatorNode(
    [
      new DebugEstimationConstantNode("B"),
      new DebugEstimationConstantNode("C"),
    ],
    "D"
  );
  const M = new DebugEstimationCombinatorNode(
    [
      new DebugEstimationConstantNode("H"),
      new DebugEstimationConstantNode("I"),
      new DebugEstimationConstantNode("J"),
      new DebugEstimationConstantNode("K"),
      new DebugEstimationConstantNode("L"),
    ],
    "M"
  );

  // Second
  const E = new DebugEstimationCombinatorNode(
    [
      new DebugEstimationConstantNode("A"),
      D,
    ],
    "E"
  );
  const N = new DebugEstimationCombinatorNode(
    [
      new DebugEstimationConstantNode("G"),
      M
    ],
    "N"
  );

  // First
  const O = new DebugEstimationCombinatorNode(
    [
      E,
      new DebugEstimationConstantNode("F"),
      N
    ],
    "O"
  );


  const estimation = new Estimation(O);
  return (
    <EstimationDisplay width={ 700 } height={ 700 } estimation={ estimation }></EstimationDisplay>
  );
}

function AwakeRightNowEstimation(): JSX.Element {
  // [1] https://advances.sciencemag.org/content/2/5/e1501705/tab-figures-data
  // TODO: estimate from the raw data, not from the terrible graphs
  const awakeEstimation = new Histogram({
    // Wake time estimated from [1] Figure E
    4:  0.025,  // 0.025
    5:  0.075,  // 0.05
    6:  0.300,  // 0.225
    7:  0.612,  // 0.312
    8:  0.812,  // 0.2
    9:  0.924,  // 0.112
    10: 0.975,  // 0.05
    11: 1.000,  // 0.025
    12: 1,
    13: 1,
    14: 1,
    15: 1,
    16: 1,
    17: 1,
    18: 1,
    // Bed time estimated from one of the worst datavis I've seen, figure D
    19: 0.975, // 0.025
    20: 0.950, // 0.025
    21: 0.900, // 0.05
    22: 0.625, // 0.275
    23: 0.275, // 0.35
    0:  0.075, // 0.2
    1:  0.025, // 0.05
    2:  0.000, // 0.025
    3:  0
  });

  const populationByHour = EstimationNode.factory(
    [new ConstantEstimationNode(new PopulationByTimezone()), new ConstantEstimationNode(new ScalarFact(DateTime.local()))],
    EstimationOperation.ApplyParameter);
  const awakePerHour = EstimationNode.factory(
    [populationByHour, new ConstantEstimationNode(awakeEstimation)],
    EstimationOperation.Multiply);

  const totalAwake = EstimationNode.factory(
      [awakePerHour], EstimationOperation.Sum);
  const estimation = new Estimation(totalAwake);
  return (
    <EstimationDisplay width={ 500 } height={ 700 } estimation={ estimation }></EstimationDisplay>
  );
}

function App() {
  return (
    <div className="App">
      { SampleLargerEstimation() }
      { AwakeRightNowEstimation() }
    </div>
  );
}

export default App;
