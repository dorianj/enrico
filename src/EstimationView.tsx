import React from 'react';

import { Estimation, EstimationNode  } from './estimation';
import { EstimationLayout  } from './EstimationLayout';
import formatters from "./formatters";

type EstimationViewProps = {
  width: number,
  height: number,
  estimation: Estimation,
};

type EstimationNodeViewProps = {
  node: EstimationNode,
};

function EstimationNodeView(props: EstimationNodeViewProps) {
  return (
    <div className="EstimationNodeView">
      { props.node }
    </div>
  )
}

export default function EstmationView({width, height, estimation}: EstimationViewProps) {
  const layout = new EstimationLayout(width, height, estimation);

  //const nodeViews = estimation.

  const formattedPopulation = formatters.wholeNumberWithCommas(
    estimation.terminalNode.output.scalar().value);

  return (
    <div className="EstimationView">
      <div className="info">
        This digram is { layout.depth } tall
      </div>

      <canvas className="estimation" width= { width } height={ height }>
        { }
      </canvas>

      <div className="total">
        There are about { formattedPopulation } people awake right now.
      </div>
    </div>
  );
}
