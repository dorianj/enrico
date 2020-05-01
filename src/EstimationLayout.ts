import _ from 'lodash';

import { Estimation, EstimationNode, isEstimationNode } from './estimation';
import { Computable } from './facts';

export class EstimationLayout {
  constructor(readonly estimation: Estimation) {

  }

  // How many nodes high will this visualization be?
  get height(): number {
    function _traverseNode(node: EstimationNode, height: number): number {
      return _(node.inputs)
        .map(element => {
          if (isEstimationNode(element)) {
            return _traverseNode(element, height + 1);
          } else {
            return height;
          }
        })
        .max() || 1;
    }

    return _traverseNode(this.estimation.terminalNode, 1);
  }
}
