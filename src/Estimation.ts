import _ from 'lodash';

import { Computable, Fact, ParameterizedFact, ScalarFact } from './facts';

export enum EstimationOperation {
  ApplyParameter,
  Multiply,
  Sum
}

function isParameterizedFact(c: unknown): c is ParameterizedFact<Fact> {
  return (c as ParameterizedFact<Fact>).atParameter !== undefined;
}

export function isEstimationNode(c: unknown): c is EstimationNode {
  return (c as EstimationNode).inputs !== undefined;
}

export class EstimationNode {
  computableInputs: Computable[];

  constructor(
    readonly inputs: Array<Computable | EstimationNode>,
    readonly operation: EstimationOperation) {
      this.computableInputs = this.inputs.map(input => isEstimationNode(input) ? input.output : input);
  }

  get output(): Computable {
    switch (this.operation) {
      case EstimationOperation.Multiply:
        if (this.computableInputs.length !== 2) {
          throw new Error(`Can't multiply ${this.computableInputs.length} inputs.`);
        }

        return this.computableInputs[0].multiply(this.computableInputs[1]);

      case EstimationOperation.ApplyParameter:
        if (this.computableInputs.length !== 2) {
          throw new Error(`Can't apply parameter to ${this.computableInputs.length} inputs.`);
        }

        const parameterizable = this.computableInputs[0];
        if (!isParameterizedFact(parameterizable)) {
          throw new Error(`Can't apply parameter to ${typeof this.computableInputs[0]}`);
        }

        return parameterizable.atParameter(this.computableInputs[1]);

      case EstimationOperation.Sum:
        return new ScalarFact<number>(_(this.computableInputs)
          .map(input => input.sum())
          .sum());
    }
  }
}

export class Estimation {
  constructor(readonly terminalNode: EstimationNode) {
  }
}
