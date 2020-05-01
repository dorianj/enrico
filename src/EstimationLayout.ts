import _ from 'lodash';

import { Estimation, EstimationNode } from './estimation';

const LAYOUT_ITEM_SQUARE_SIZE = 100;
const LAYOUT_ITEM_SQUARE_PADDING = 30;

export class LayoutItem {
  public position: {
    width: number,
    height: number,
    x: number,
    y: number,
  };

  constructor(
    readonly node: EstimationNode,
    readonly depth: number,
    readonly inputs: LayoutItem[]
  ) {
    this.position = {
      width: LAYOUT_ITEM_SQUARE_SIZE,
      height: LAYOUT_ITEM_SQUARE_SIZE,
      x: 0,
      y: 0,
    }
  }
}

export class EstimationLayout {
  readonly depth: number;
  readonly rootLayoutItem: LayoutItem;
  readonly allLayoutItems: LayoutItem[];

  constructor(
    readonly width: number,
    readonly height: number,
    readonly estimation: Estimation
  ) {
      const _traverseNode = (node: EstimationNode, accumulator: number): LayoutItem => {
        const inputs = node.inputs.map((input) => _traverseNode(input, accumulator + 1));

        const item = new LayoutItem(node, accumulator, inputs);
        this.allLayoutItems.push(item);
        return item;
      };

      this.allLayoutItems = [];
      this.rootLayoutItem = _traverseNode(this.estimation.terminalNode, 1);

      this.depth = _(this.allLayoutItems)
        .map(item => item.depth)
        .max() || 0;

      this.performLayout();
  }

  private performLayout() {
    this.itemsByDepth.forEach((items) => {
      items.forEach((layoutItem, i) => {
        layoutItem.position.y = LAYOUT_ITEM_SQUARE_PADDING + (this.depth - layoutItem.depth) * (LAYOUT_ITEM_SQUARE_SIZE + LAYOUT_ITEM_SQUARE_PADDING);
        layoutItem.position.x = LAYOUT_ITEM_SQUARE_PADDING + i * (LAYOUT_ITEM_SQUARE_SIZE + LAYOUT_ITEM_SQUARE_PADDING);
      });
    });
  }

  private get itemsByDepth(): Map<number, LayoutItem[]> {
    const m = new Map();

    this.allLayoutItems.forEach(item => {
      const list = m.get(item.depth);
      if (list === undefined) {
        m.set(item.depth, [item]);
      } else {
        list.push(item);
      }
    });

    return m;
  }
}
