import React, { useEffect, useRef } from 'react';

import { Estimation, EstimationNode } from './estimation';
import { EstimationLayout, LayoutItem  } from './EstimationLayout';
import { EstimationNodeView } from './EstimationNodeView';

type EstimationViewProps = {
  width: number,
  height: number,
  estimation: Estimation,
  setInspectedNode: (value: EstimationNode) => void,
};

function drawConnectingLines(layout: EstimationLayout, canvasContext: CanvasRenderingContext2D): void {
  layout.rootLayoutItem.postorderTraversal((item: LayoutItem) => {
    item.inputs.forEach((input: LayoutItem) => {
      canvasContext.beginPath();
      canvasContext.strokeStyle = 'orange';
      const from = input.outputCoordinate;
      const to = item.inputCoordinate(input.inputIndex)
      canvasContext.moveTo(from[0], from[1] + 3);
      canvasContext.bezierCurveTo(
        from[0] + (to[0] - from[0]) / 3, to[1],
        from[0] + (to[0] - from[0]) / 2, from[1],
        to[0], to[1] - 3
      );

      canvasContext.lineWidth = 2;
      canvasContext.stroke();
    });
  }, null);
}

export function EstimationView({width, height, estimation, setInspectedNode}: EstimationViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layout = new EstimationLayout(width, height, estimation);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawConnectingLines(layout, ctx);
    }
  });

  const nodeViews = layout.allLayoutItems.map((layoutItem, index) => {
    return (
      <div key={ index }>
        <EstimationNodeView layoutItem={ layoutItem } setInspectedNode={ setInspectedNode }/>
      </div>
    );
  });

  const style = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative' as 'relative',
  };

  return (
    <div className="EstimationView" style={ style }>
      <canvas width={ width } height={ height } ref={ canvasRef }></canvas>
      <div>
        { nodeViews }
      </div>
    </div>
  );
}
