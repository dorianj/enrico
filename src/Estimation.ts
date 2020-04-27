import { Fact } from './facts';

class EstimationNode {
  input: Fact;
  next: EstimationNode;

  constructor(input: Fact, next: EstimationNode) {
    this.input = input;
    this.next = next;
  }
}

export default class Estimation {


  constructor() {

  }
}
