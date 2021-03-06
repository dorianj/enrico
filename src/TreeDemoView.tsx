import React from 'react';

import { Computable, ScalarFact } from './facts';
import { Estimation, EstimationNode } from './estimation';
import { EstimationPage } from './EstimationPage';

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
    <EstimationPage estimation={ estimation } />
  );
}

export function TreeDemoView() {
  return (
    <div>
      { SampleLargerEstimation() }
    </div>
  );
}
