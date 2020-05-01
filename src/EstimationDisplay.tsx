import React from 'react';

import { Estimation  } from './estimation';
import formatters from "./formatters";

type EstimationDisplayProps = {
  estimation: Estimation,
}

export default function EstmationDisplay(props: EstimationDisplayProps) {
  const formattedPopulation = formatters.wholeNumberWithCommas(
    props.estimation.terminalNode.output.scalar().value);

  return (
    <div className="EstmationDisplay">
      There are about { formattedPopulation } people awake right now.
    </div>
  );
}
