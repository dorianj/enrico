import _ from "lodash";
import { DateTime } from "luxon";
import React from 'react';

import { EstimationNode } from './estimation';
import formatters from "./formatters";
import { LUTFact, isLUTFact, isScalarFact, ScalarFact } from './facts';

export type NodeInspectorViewProps = {
  node: EstimationNode
};

type LUTViewProps = {
  lut: LUTFact,
};

function LUTView({lut}: LUTViewProps) {
  const rows = _(lut.lut)
    .toPairs()
    .map(([key, value], index) => {
      return (
        <tr key={ index }>
          <td>{ key }</td>
          <td>{ value }</td>
        </tr>
      )
    })
    .value();

  return (
    <div>
      <div>
        <strong>Output Type:</strong> lookup table (LUT)<br/>
        <strong>Output items:</strong> { rows.length }
      </div>
      <pre>
        <table>
          <thead>
            <tr>
              <th style={ ({ minWidth: "100px" }) }>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            { rows }
          </tbody>
        </table>
      </pre>
    </div>
  )
}

type ScalarViewProps = {
  scalar: ScalarFact<number>,
};

function ScalarView({scalar}: ScalarViewProps) {
  const value = scalar.value;
  const [typeLabel, formattedOutput] = ((): [string, string] => {
    if (DateTime.isDateTime(value)) {
      return ["ISO date", value.toISO()];
    } else if (typeof value === "number") {
      if (value > 1000000) {
        return ["number", `${formatters.wholeNumberWithCommas(value)}`];
      } else {
        return ["number", `${value}`];
      }
    }

    return ["string", `${value}`];
  })();

  return (
    <div>
      <div>
        <div>
          <strong>Output Type:</strong> scalar ({ typeLabel })
        </div>
        <div>
         <strong>Output Value:</strong> { formattedOutput }
        </div>
      </div>
    </div>
  );
}

export function NodeInspectorView({node}: NodeInspectorViewProps) {
  const output = node.output;
  let outputView = null;
  if (isLUTFact(output)) {
    outputView = (<LUTView lut={ output } />);
  } else if (isScalarFact(output)) {
    outputView = <ScalarView scalar={ output }/>;
  }

  return (
    <div className="NodeInspector">
      <div>
        <strong>Type:</strong> { node.label }
      </div>
      <div>
        <strong>Provenance:</strong> Unknown
      </div>
      <hr/>
      <div>
        { outputView }
      </div>
      <hr/>
      <div>
        <strong>Inputs:</strong> { node.inputs.length }
      </div>
    </div>
  );
}
