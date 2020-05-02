import _ from 'lodash';

import { Estimation, EstimationNode } from './estimation';

const ITEM_SIZE = 60;
const ITEM_PADDING = 30;

export class LayoutItem {
  public output: LayoutItem | null = null;
  public width: number = ITEM_SIZE - 10;
  public height: number = ITEM_SIZE - 10;
  public x: number = -1;
  public y: number = 0;
  public mod: number = 0;

  public inputIndex: number = -1;

  public debugInfo: string = "";

  constructor(
    readonly node: EstimationNode,
    readonly depth: number,
    readonly inputs: LayoutItem[]
  ) {
  }

  postorderTraversal<T>(iterator: (item: LayoutItem, accumulator: T) => T, initial: T) {
    const _traverse = (item: LayoutItem, accumulator: T): void => {
      item.inputs.forEach(item => _traverse(item, accumulator));
      accumulator = iterator(item, accumulator);
    };

    _traverse(this, initial);
  }

  preorderTraversal<T>(iterator: (item: LayoutItem, accumulator: T) => T, initial: T) {
    const _traverse = (item: LayoutItem, accumulator: T): void => {
      accumulator = iterator(item, accumulator);
      item.inputs.forEach(item => _traverse(item, accumulator));
    };

    _traverse(this, initial);
  }

  get isLeaf(): boolean {
    return this.inputs.length === 0;
  }

  get isLeftmost(): boolean {
    return this.output === null || this.output.inputs[0] === this;
  }

  get isRightmost(): boolean {
    return this.output === null || _.last(this.output.inputs) === this;
  }

  get previousSibling(): LayoutItem | null {
    if (this.output === null || this.isLeftmost) {
      return null;
    }

    return this.output.inputs[this.inputIndex - 1];
  }

  get leftSiblings(): LayoutItem[] {
    return this.output === null ? [] : this.output.inputs.slice(0, this.inputIndex);
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
      const _traverseNode = (node: EstimationNode, depth: number): LayoutItem => {
        const inputs = node.inputs.map((input) => _traverseNode(input, depth + 1));

        const item = new LayoutItem(node, depth, inputs);
        inputs.forEach((layoutItem, index) => {
          layoutItem.output = item;
          layoutItem.inputIndex = index;
        });
        this.allLayoutItems.push(item);
        return item;
      };

      this.allLayoutItems = [];
      this.rootLayoutItem = _traverseNode(this.estimation.terminalNode, 0);

      this.depth = _(this.allLayoutItems)
        .map(item => item.depth)
        .max() || 0;

      this.performLayout();
  }

  private contour(item: LayoutItem, reduce: (...vals: number[]) => number): Map<number, number> {
    const contour = new Map<number, number>();

    item.preorderTraversal((item, modSum) => {
      const y = contour.get(item.y);
      if (y === undefined) {
        contour.set(item.y, item.x + modSum);
      } else {
        contour.set(item.y, reduce(y, item.x + modSum))
      }

      return modSum + item.mod;
    }, 0);

    return contour;
  }

  private centerItemsBetween(left: LayoutItem, right: LayoutItem) {
    const leftIndex = left.output?.inputs.indexOf(left) || 0;
    const rightIndex = right.output?.inputs.indexOf(right) || 0;

    const nodesBetween = leftIndex - rightIndex;
    if (nodesBetween > 1) {
      const distanceBetween = (left.x - right.x) / nodesBetween;

      let count = 1;
      for (let i = rightIndex + 1; i < leftIndex; i++) {
        const middleNode = left.output?.inputs[i];
        if (middleNode !== undefined) {
          const desiredX = right.x + distanceBetween * count;
          const offset = desiredX - middleNode?.x;
          middleNode.x += offset;
          middleNode.mod += offset;
        }

        count++;
      }

      this.fixConflicts(left);
    }
  }

  private fixConflicts(item: LayoutItem) {
    const minDistance = ITEM_SIZE + 50;
    let shift = 0;
    const contourMax = (map: Map<number, number>) => Math.max(...Array.from(map.keys()));

    const contour = this.contour(item, Math.min);

    if ((item.node as any).label_ == "E") {
      (item.node as any).label_ += "";
    }
    console.log("\t", (item.node as any).label_, "left contour", contour);

    item.leftSiblings.forEach((sibling) => {
      const siblingContour = this.contour(sibling, Math.max);
      console.log("\t\t", (sibling.node as any).label_, "right contour", siblingContour);
      const maxDepth = Math.min(
        contourMax(siblingContour),
        contourMax(contour)
      );

      console.log("\t\t\t", "extent", [item.y + 1, maxDepth]);

      for (let depth = item.y + 1; depth <= maxDepth; depth++) {
        const distance = (contour.get(depth) || 0) - (siblingContour.get(depth) || 0);
        console.log("\t\t\t", "distance", distance);

        if (distance + shift <= minDistance) {
          shift = minDistance - distance;
        }
      }

      if (shift > 0) {
        console.log("\t\tshift", shift);
        item.x += shift;
        item.mod += shift;
        this.centerItemsBetween(item, sibling);
        shift = 0;
      }
    });
  }

  private calculateInitialPosition() {
    this.rootLayoutItem.postorderTraversal((item: LayoutItem) => {
      console.log(item.node.label);
      item.y = /*this.depth - */item.depth;

      item.x = ((): number => {
        if (item.isLeaf) {
          if (item.previousSibling !== null) {
            return item.previousSibling.x + ITEM_SIZE + ITEM_PADDING;
          } else {
            return 0;
          }
        } else if (item.inputs.length === 1) {
          if (item.isLeftmost) {
            return item.inputs[0].x;
          } else {
            if (item.previousSibling !== null) {
              const newX = item.previousSibling.x + ITEM_SIZE + ITEM_PADDING;
              item.mod = newX - item.inputs[0].x;
              return newX;
            } else {
              throw new Error("should be unreachable");
            }
          }
        } else {
          const mid = (item.inputs[0].x + item.inputs[item.inputs.length - 1].x) / 2;

          if (item.isLeftmost) {
            return mid;
          } else {
            if (item.previousSibling !== null) {
              const newX = item.previousSibling.x + ITEM_SIZE + ITEM_PADDING;
              item.mod = newX - mid;
              return newX;
            } else {
              throw new Error("should be unreachable");
            }
          }
        }
      })();

      if (item.inputs.length > 0 && !item.isLeftmost) {
        this.fixConflicts(item);
      }
     }, null);
  }

  private checkItemsOnscreen() {
    const contour = this.contour(this.rootLayoutItem, Math.min);

    let shift = 0;
    contour.forEach((contourAmount, y) => {
      if (contourAmount + shift < 0) {
        shift = contourAmount * -1;
      }
    });

    if (shift > 0) {
      this.rootLayoutItem.x += shift;
      this.rootLayoutItem.mod += shift;
    }
  }

  private calculateFinalPositions() {
    this.rootLayoutItem.preorderTraversal((item: LayoutItem, mod: number): number => {
      item.y = (this.depth - item.y) * ITEM_SIZE;
      item.x += mod;
      return mod + item.mod;
    }, 0);
  }

  private performLayout() {
    this.calculateInitialPosition();
    this.checkItemsOnscreen();
    this.calculateFinalPositions();
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
