import _ from 'lodash';

import { Estimation, EstimationNode } from './estimation';

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

  get allNodes(): EstimationNode[] {
    const untraversed: EstimationNode[] = [];
    const traversed: EstimationNode[] = [];

    untraversed.push(...this.estimation.terminalNode.inputs);

    while (untraversed.length) {
      const node = untraversed.pop();
      if (node !== undefined) {
        traversed.push(node);
        untraversed.push(...node.inputs);
      }
    }

    return traversed;
  }
}
