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
  const [inspectedNode, setInspectedNode] = useState<EstimationNode | null>(estimation.terminalNode);
  const width = 500, height = 800;
  const layout = new EstimationLayout(width, height, estimation);

  return (
    <div className="EstimationPage">
      <EstimationView width={ width } height={ height } layoutItems={ layout.allLayoutItems } setInspectedNode={ (node) => setInspectedNode(node) } />
      { inspectedNode && <NodeInspectorView node={ inspectedNode } /> }
    </div>
  );
}
