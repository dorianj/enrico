import React from 'react';

import { EstimationNode } from './estimation';
import formatters from "./formatters";

type EstimationNodeViewProps = {
  node: EstimationNode,
}

export default function EstmationView(props: EstimationNodeViewProps) {

  return (
    <div className="EstmationNodeView">
      estimation node
    </div>
  );
}
