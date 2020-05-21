import React, { useState } from 'react';

import { Estimation, EstimationNode } from './estimation';
import { EstimationLayout } from './EstimationLayout';
import { EstimationView } from './EstimationView';
import { NodeInspectorView } from './NodeInspectorView';

import './EstimationPage.css';

type EstimationPageProps = {
  estimation: Estimation,
}

export function EstimationPage({estimation}: EstimationPageProps) {
  const width = 500, height = 800;

  const [inspectedNode, setInspectedNode] = useState<EstimationNode | null>(estimation.terminalNode);
  const [layoutItems, setLayoutItems] = useState(() => {
    const layout = new EstimationLayout(width, height, estimation);
    return layout.allLayoutItems;
  });

  return (
    <div className="EstimationPage">
      <EstimationView
        width={ width }
        height={ height }
        layoutItems={ layoutItems }
        setInspectedNode={ (node) => setInspectedNode(node) }
        setLayoutItems={ (layoutItems) => setLayoutItems(layoutItems) }
        />
      { inspectedNode && <NodeInspectorView node={ inspectedNode } /> }
    </div>
  );
}
