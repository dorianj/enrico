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

export abstract class EstimationNode {
  static readonly inputSlots: number | null;

  constructor(readonly inputs: EstimationNode[]) {
  }

  abstract get output(): Computable;

  static factory(inputs: EstimationNode[], operation: EstimationOperation): EstimationNode {
    const klass = (() => {
      switch (operation) {
        case EstimationOperation.Multiply:
          return MultiplyEstimationNode;
        case EstimationOperation.ApplyParameter:
          return ApplyParameterEstimationNode;
        case EstimationOperation.Sum:
          return SumEstimationNode;
      }
    })();

    if (klass.inputSlots !== null && inputs.length !== klass.inputSlots) {
      throw new Error(
        `${klass.name} given ${inputs.length} inputs into ${klass.inputSlots} slots`);
    }

    return new klass(inputs);
  }
}

export class ConstantEstimationNode extends EstimationNode {
  static readonly inputSlots = 0;

  constructor(private constant: Computable) {
    super([]);
  }

  get output(): Computable {
    return this.constant;
  }
}

class SumEstimationNode extends EstimationNode {
  static readonly inputSlots = null;

  get output(): Computable {
    return new ScalarFact<number>(_(this.inputs)
      .map(input => input.output.sum())
      .sum());
  }
}

class MultiplyEstimationNode extends EstimationNode {
  // TODO (dorianj): maybe this should be infinite?
  // The challenge is that certain types aren't commutative when multiplying
  static readonly inputSlots = 2;

  get output(): Computable {
    return this.inputs[0].output.multiply(this.inputs[1].output);
  }
}

class ApplyParameterEstimationNode extends EstimationNode {
  static readonly inputSlots = 2;

  readonly parameterizable: ParameterizedFact<Fact>;

  constructor(inputs: EstimationNode[]) {
    super(inputs);

    const possiblyParameterized = this.inputs[0].output;
    if (isParameterizedFact(possiblyParameterized)) {
      this.parameterizable = possiblyParameterized;
    } else {
      throw new Error(`Can't apply parameter to ${this.inputs[0]}`);
    }
  }

  get output(): Computable {
    // TRICKY (dorianj): at time this code was written, Fact and Computable were identical,
    // but Fact is actually a descendent of Computable so this may break later
    return this.parameterizable.atParameter(this.inputs[1].output);
  }
}

export class Estimation {
  constructor(readonly terminalNode: EstimationNode) {
  }
}
