import _ from 'lodash';

import { Estimation, EstimationNode } from './estimation';
import { Computable } from './facts';

export class EstimationLayout {
  constructor(
    readonly width: number,
    readonly height: number,
    readonly estimation: Estimation) {
  }

  // How many nodes wide/high will this visualization be?
  get depth(): number {
    function _traverseNode(node: EstimationNode, accumulator: number): number {
      return _(node.inputs)
        .map((input) => _traverseNode(input, accumulator + 1))
        .max() || accumulator;
    }

    return _traverseNode(this.estimation.terminalNode, 1);
  }

  get allNodes(): Array<Computable | EstimationNode> {
    //const untraversed = [];
    ///const traversed = [];
    return [];
  }
}
