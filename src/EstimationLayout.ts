import _ from 'lodash';

import { Estimation, EstimationNode } from './estimation';

const ITEM_SIZE = 75;
const PADDING_HORIZONTAL = 20;
const PADDING_VERTICAL = 60;

export type Coordinate = [number, number];

export class LayoutItem {
  public output: LayoutItem | null = null;
  readonly width: number = ITEM_SIZE;
  readonly height: number = ITEM_SIZE;
  readonly inputWidth = 10;
  readonly inputHeight = 9;
  public x: number = -1;
  public y: number = 0;

  public inputIndex: number = -1;

  // Bookeeping only used for the layout engine
  public mod: number = 0;

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

  get previousSibling(): LayoutItem | null {
    if (this.output === null || this.isLeftmost) {
      return null;
    }

    return this.output.inputs[this.inputIndex - 1];
  }

  get leftSiblings(): LayoutItem[] {
    return this.output === null ? [] : this.output.inputs.slice(0, this.inputIndex);
  }

  get outputCoordinate(): Coordinate {
    return [this.x + this.width / 2, this.y + this.height];
  }

  inputCoordinate(index: number): Coordinate {
    const inputBlockWidth = this.inputWidth * (this.inputs.length + 1);
    const inputBlockStart = this.width / 2 - inputBlockWidth / 2;


    return [this.x + inputBlockStart + this.inputWidth * (index + 1), this.y];
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

    item.leftSiblings.forEach((sibling) => {
      const siblingContour = this.contour(sibling, Math.max);
      const maxDepth = Math.min(
        contourMax(siblingContour),
        contourMax(contour)
      );

      for (let depth = item.y + 1; depth <= maxDepth; depth++) {
        const distance = (contour.get(depth) || 0) - (siblingContour.get(depth) || 0);

        if (distance + shift <= minDistance) {
          shift = minDistance - distance;
        }
      }

      if (shift > 0) {
        item.x += shift;
        item.mod += shift;
        this.centerItemsBetween(item, sibling);
        shift = 0;
      }
    });
  }

  private calculateInitialPosition() {
    this.rootLayoutItem.postorderTraversal((item: LayoutItem) => {
      item.y = item.depth;

      item.x = ((): number => {
        if (item.isLeaf) {
          if (item.previousSibling !== null) {
            return item.previousSibling.x + ITEM_SIZE + PADDING_HORIZONTAL;
          } else {
            return 0;
          }
        } else if (item.inputs.length === 1) {
          if (item.isLeftmost) {
            return item.inputs[0].x;
          } else {
            if (item.previousSibling !== null) {
              const newX = item.previousSibling.x + ITEM_SIZE + PADDING_HORIZONTAL;
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
              const newX = item.previousSibling.x + ITEM_SIZE + PADDING_HORIZONTAL;
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
      item.y = (this.depth - item.y) * (ITEM_SIZE + PADDING_VERTICAL);
      item.x += mod;
      return mod + item.mod;
    }, 0);
  }

  private performLayout() {
    this.calculateInitialPosition();
    this.checkItemsOnscreen();
    this.calculateFinalPositions();
  }
}
