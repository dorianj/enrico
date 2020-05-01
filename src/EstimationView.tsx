import React from 'react';

import { Estimation } from './estimation';
import { EstimationLayout, LayoutItem  } from './EstimationLayout';
import formatters from "./formatters";

type EstimationViewProps = {
  width: number,
  height: number,
  estimation: Estimation,
};

type EstimationNodeViewProps = {
  layoutItem: LayoutItem
};


function EstimationNodeView({layoutItem}: EstimationNodeViewProps) {
  const style = {
    width: `${layoutItem.position.width}px`,
    height: `${layoutItem.position.height}px`,
    top: `${layoutItem.position.y}px`,
    left: `${layoutItem.position.x}px`,
  };
  return (
    <div className="EstimationNodeView" style={ style } key={ JSON.stringify(style) }>
      { layoutItem.node.label }
    </div>
  )
}

export default function EstmationView({width, height, estimation}: EstimationViewProps) {
  const layout = new EstimationLayout(width, height, estimation);

  console.log("layout root", layout.rootLayoutItem);
  const nodeViews = layout.allLayoutItems.map(layoutItem => EstimationNodeView({layoutItem}));

  const formattedPopulation = formatters.wholeNumberWithCommas(
    estimation.terminalNode.output.scalar().value);

  const paletteStyle = {
    width: `${width}px`,
    height: `${height}px`,
  }

  return (
    <div className="EstimationView">
      <div className="info">
        This digram is { layout.depth } tall with { layout.allLayoutItems.length } items
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
