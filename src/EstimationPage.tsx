import React, { useState } from 'react';

import { Estimation, EstimationNode } from './estimation';
import { EstimationView } from './EstimationView';
import { NodeInspectorView } from './NodeInspectorView';


import './EstimationPage.css';

type EstimationPageProps = {
  estimation: Estimation,
}

export function EstimationPage({estimation}: EstimationPageProps) {
  const [inspectedNode, setInspectedNode] = useState<EstimationNode | null>(estimation.terminalNode);

  return (
    <div className="EstimationPage">
      <EstimationView width={500} height={700} estimation={ estimation } setInspectedNode={ (node) => setInspectedNode(node) } />
      { inspectedNode && <NodeInspectorView node={ inspectedNode } /> }
    </div>
  );
}
