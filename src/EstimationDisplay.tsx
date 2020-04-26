import React from 'react';
import { DateTime } from "luxon";

import { PopulationByTimezone } from './facts';

function EstmationDisplay() {
  const populationByHour = new PopulationByTimezone().atTime(DateTime.local());


  // [1] https://advances.sciencemag.org/content/2/5/e1501705/tab-figures-data
  // TODO: estimate from the raw data, not from the terrible graphs
  const awakeEstimation = {
    // Wake time estimated from [1] Figure E
    4:  0.025,  // 0.025
    5:  0.075,  // 0.05
    6:  0.300,  // 0.225
    7:  0.612,  // 0.312
    8:  0.812,  // 0.2
    9:  0.924,  // 0.112
    10: 0.975,  // 0.05
    11: 1.000,  // 0.025
    12: 1,
    13: 1,
    14: 1,
    15: 1,
    16: 1,
    17: 1,
    18: 1,
    // Bed time estimated from one of the worst datavis I've seen, figure D
    19: 0.975, // 0.025
    20: 0.950, // 0.025
    21: 0.900, // 0.05
    22: 0.625, // 0.275
    23: 0.275, // 0.35
    0:  0.075, // 0.2
    1:  0.025, // 0.05
    2:  0.000, // 0.025
    3:  0
  };

  console.log("EstmationDisplay", populationByHour);
  return (
    <div className="EstmationDisplay">
    </div>
  );
}

export default EstmationDisplay;
