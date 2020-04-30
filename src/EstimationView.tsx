import React from 'react';

import { Estimation  } from './estimation';
import formatters from "./formatters";

type EstimationViewProps = {
  estimation: Estimation,
}

export default function EstmationView(props: EstimationViewProps) {
  const formattedPopulation = formatters.wholeNumberWithCommas(
    props.estimation.terminalNode.output.scalar().value);

  return (
    <div className="EstmationView">
      There are about { formattedPopulation } people awake right now.
    </div>
  );
}
