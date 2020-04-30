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

export class EstimationNode implements Computable {
  constructor(
    readonly inputs: Computable[],
    readonly operation: EstimationOperation) {
  }

  get output(): Computable {
    switch (this.operation) {
      case EstimationOperation.Multiply:
        if (this.inputs.length !== 2) {
          throw new Error(`Can't multiply ${this.inputs.length} inputs.`);
        }

        return this.inputs[0].multiply(this.inputs[1]);

      case EstimationOperation.ApplyParameter:
        if (this.inputs.length !== 2) {
          throw new Error(`Can't apply parameter to ${this.inputs.length} inputs.`);
        }

        const parameterizable = this.inputs[0];
        if (!isParameterizedFact(parameterizable)) {
          throw new Error(`Can't apply parameter to ${typeof this.inputs[0]}`);
        }

        return parameterizable.atParameter(this.inputs[1]);

      case EstimationOperation.Sum:
        return new ScalarFact<number>(_(this.inputs)
          .map(input => input.sum())
          .sum());
    }
  }

  sum(): number {
    return _(this.inputs).map(input => input.sum()).sum();
  }

  multiply(other: Computable): Computable {
    return this.inputs.reduce((accumulator, value) => {
      return accumulator.multiply(value);
    }, new ScalarFact(1));
  }

  scalar(): ScalarFact<number> {
    return this.output.scalar();
  }
}

export class Estimation {
  constructor(readonly terminalNode: EstimationNode) {

  }
}
