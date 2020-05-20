import React, { useEffect, useRef } from 'react';


import { Estimation } from './estimation';
import { EstimationLayout, LayoutItem  } from './EstimationLayout';
import formatters from "./formatters";
import { createGzip } from 'zlib';

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
    width: `${layoutItem.width}px`,
    height: `${layoutItem.height}px`,
    top: `${layoutItem.y}px`,
    left: `${layoutItem.x}px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const inputDivs = layoutItem.inputs.map((input: LayoutItem) => {
    const left = layoutItem.inputCoordinate(input.inputIndex)[0] - layoutItem.x - input.inputWidth / 2
    const inputStyle = {
      width: `${layoutItem.inputWidth}px`,
      height: `${layoutItem.inputHeight}px`,
      top: `-5px`,
      left: `${left}px`,
      position: 'absolute' as 'absolute'
    }
    return (
      <div className="inputLabel" style={ inputStyle }></div>
    )
  })

  return (
    <div className="EstimationNodeView" style={ style } key={ JSON.stringify(style) }>
      <div className="inputs">
        { inputDivs }
      </div>
      { layoutItem.node.label }
    </div>
  )
}

type LineViewProps = {
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
};


export default function EstmationView({width, height, estimation}: EstimationViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const layout = new EstimationLayout(width, height, estimation);

  const nodeViews = layout.allLayoutItems.map(layoutItem => EstimationNodeView({layoutItem}));
  const lineViews: JSX.Element[] = [];

  useEffect(() => {
    layout.rootLayoutItem.postorderTraversal((item: LayoutItem) => {
      item.inputs.forEach((input: LayoutItem) => {
        const b = canvasRef.current;
        if (b === null) {
          return;
        }

        const ctx = b.getContext("2d");
        if (ctx !== null) {
          ctx.beginPath();
          ctx.strokeStyle = 'orange';
          const from = input.outputCoordinate;
          const to = item.inputCoordinate(input.inputIndex)
          ctx.moveTo(from[0], from[1] - 1);
          ctx.bezierCurveTo(
            from[0] + (to[0] - from[0]) / 3, to[1],
            from[0] + (to[0] - from[0]) / 1.5, from[1],
            to[0], to[1] + 1
          );

          ctx.lineCap = "round";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

      });
    }, null);
  });


  const formattedOutput = formatters.wholeNumberWithCommas(
    estimation.terminalNode.output.scalar().value);

  const paletteStyle = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative' as 'relative',
  }

  return (
    <div className="EstimationView">
      <div className="palette" style={ paletteStyle }>
        <canvas width={ width } height={ height } ref={ canvasRef }></canvas>
        { nodeViews }
      </div>

      <div className="total">
        Output: { formattedOutput }
      </div>
    </div>
  );
}
