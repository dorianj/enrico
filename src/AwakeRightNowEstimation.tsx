import React from 'react';
import { DateTime } from "luxon";

import { Estimation, EstimationNode, EstimationOperation, ConstantEstimationNode } from './estimation';
import { EstimationPage } from './EstimationPage';
import { PopulationByTimezone, Histogram, ScalarFact } from './facts';

export function AwakeRightNowEstimation(): JSX.Element {
  // [1] https://advances.sciencemag.org/content/2/5/e1501705/tab-figures-data
  // TODO: estimate from the raw data, not from the terrible graphs
  const awakeEstimation = new Histogram({
    // Wake time estimated from [1] Figure E
    4: 0.025,
    5: 0.075,
    6: 0.300,
    7: 0.612,
    8: 0.812,
    9: 0.924,
    10: 0.975,
    11: 1.000,
    12: 1,
    13: 1,
    14: 1,
    15: 1,
    16: 1,
    17: 1,
    18: 1,
    // Bed time estimated from one of the worst datavis I've seen, figure D
    19: 0.975,
    20: 0.950,
    21: 0.900,
    22: 0.625,
    23: 0.275,
    0: 0.075,
    1: 0.025,
    2: 0.000,
    3: 0
  });
  const populationByHour = EstimationNode.factory(
    [new ConstantEstimationNode(new PopulationByTimezone()), new ConstantEstimationNode(new ScalarFact(DateTime.local()))],
    EstimationOperation.ApplyParameter);
  const awakePerHour = EstimationNode.factory(
    [populationByHour, new ConstantEstimationNode(awakeEstimation)],
    EstimationOperation.Multiply);
  const totalAwake = EstimationNode.factory([awakePerHour], EstimationOperation.Sum);
  const estimation = new Estimation(totalAwake);
  return (<EstimationPage estimation={estimation} />);
}
