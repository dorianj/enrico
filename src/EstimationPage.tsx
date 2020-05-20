import React from 'react';

import { Estimation  } from './estimation';
import { EstimationView } from './EstimationView';
import formatters from "./formatters";

type EstimationPageProps = {
  estimation: Estimation,
}

export function EstimationPage({estimation}: EstimationPageProps) {
  const formattedPopulation = formatters.wholeNumberWithCommas(
    estimation.terminalNode.output.scalar().value);

  return (
    <div className="EstimationPage">
      <EstimationView width={500} height={700} estimation={estimation} />

      <div className="summary">
        There are about { formattedPopulation } people awake right now.
      </div>
    </div>
  );
}
