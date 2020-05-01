import React from 'react';

import { Estimation  } from './estimation';
import { EstimationLayout  } from './EstimationLayout';
import formatters from "./formatters";

type EstimationViewProps = {
  estimation: Estimation,
}

export default function EstmationView(props: EstimationViewProps) {
  const layout = new EstimationLayout(props.estimation);

  const formattedPopulation = formatters.wholeNumberWithCommas(
    props.estimation.terminalNode.output.scalar().value);

  return (
    <div className="EstmationView">
      <div className="info">This digram is { layout.height } tall</div>
      <div className="total">
      There are about { formattedPopulation } people awake right now.
      </div>
    </div>
  );
}
