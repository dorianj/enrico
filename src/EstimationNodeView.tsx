import React from 'react';

import { LayoutItem } from './EstimationLayout';

export type EstimationNodeViewProps = {
  layoutItem: LayoutItem
};

export function EstimationNodeView({ layoutItem }: EstimationNodeViewProps) {
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
    const left = layoutItem.inputCoordinate(input.inputIndex)[0] - layoutItem.x - input.inputWidth / 2;
    const inputStyle = {
      width: `${layoutItem.inputWidth - 1}px`,
      height: `${layoutItem.inputHeight}px`,
      top: `-4px`,
      left: `${left}px`,
      position: 'absolute' as 'absolute'
    };
    return (<div className="inputLabel" style={inputStyle}></div>);
  });

  const outputCoord = layoutItem.outputCoordinate[0] - layoutItem.x - layoutItem.inputWidth / 2;
  const outputLabelStyle = {
    width: `${layoutItem.inputWidth - 1}px`,
    height: `${layoutItem.inputHeight}px`,
    top: `${layoutItem.outputCoordinate[1] - layoutItem.y - 6}px`,
    left: `${outputCoord}px`,
    position: 'absolute' as 'absolute'
  };

  const outputDiv = (<div className="outputLabel" style={outputLabelStyle}></div>);
  return (
    <div className="EstimationNodeView" style={style} key={JSON.stringify(style)}>
      <div className="inputs">
        {inputDivs}
      </div>
      {layoutItem.node.label}
      <div className="outputs">
        {(layoutItem.output !== null) ? outputDiv : <div />}
      </div>
    </div>
    );
}
