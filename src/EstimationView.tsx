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
      it's a whole thing don't worry about it
    </div>
  )
}

export default function EstmationView({width, height, estimation}: EstimationViewProps) {
  const layout = new EstimationLayout(width, height, estimation);

  const nodeViews = layout.allNodes.map(node => EstimationNodeView({node}));

  const formattedPopulation = formatters.wholeNumberWithCommas(
    estimation.terminalNode.output.scalar().value);

  const paletteStyle = {
    width: `${width}px`,
    height: `${height}px`,
  }

  return (
    <div className="EstimationView">
      <div className="info">
        This digram is { layout.depth } tall
      </div>

      <div className="palette" style={ paletteStyle }>
        { nodeViews }
      </div>

      <div className="total">
        There are about { formattedPopulation } people awake right now.
      </div>
    </div>
  );
}
