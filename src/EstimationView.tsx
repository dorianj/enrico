import React, { useEffect, useRef } from 'react';

import { EstimationNode } from './estimation';
import { LayoutItem  } from './EstimationLayout';
import { EstimationNodeView } from './EstimationNodeView';

type EstimationViewProps = {
  width: number,
  height: number,
  layoutItems: LayoutItem[],
  setInspectedNode: (value: EstimationNode) => void,
  setLayoutItems: (layoutItems: LayoutItem[]) => void,
};

function drawConnectingLines(layoutItems: LayoutItem[], canvasContext: CanvasRenderingContext2D): void {
  layoutItems.forEach(item => {
    item.inputs.forEach(input => {
      const from = input.outputCoordinate;
      const to = item.inputCoordinate(input.inputIndex)

      canvasContext.beginPath();
      canvasContext.strokeStyle = 'orange';
      canvasContext.moveTo(from[0], from[1] + 3);
      canvasContext.bezierCurveTo(
        from[0] + (to[0] - from[0]) / 3, to[1],
        from[0] + (to[0] - from[0]) / 2, from[1],
        to[0], to[1] - 3
      );
      canvasContext.lineWidth = 2;
      canvasContext.stroke();
    });
  });
}

export function EstimationView({width, height, layoutItems, setInspectedNode, setLayoutItems}: EstimationViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnectingLines(layoutItems, ctx);
    }
  });

  const nodeViews = layoutItems.map((item, index) => {
    return (
      <EstimationNodeView key={ index } layoutItem={ item } setInspectedNode={ setInspectedNode }/>
    );
  });

  const style = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative' as 'relative',
  };

  return (
    <div className="EstimationView" style={ style }>
      <canvas width={ width } height={ height } ref={ canvasRef } />
      <div>
        { nodeViews }
      </div>
    </div>
  );
}
