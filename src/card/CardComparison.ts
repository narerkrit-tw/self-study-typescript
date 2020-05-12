import Rank from "src/card/Rank"
import { TinyType, TinyTypeOf } from "tiny-types"

export type CardComparison = RankDifference | SuitDifference;

export class RankDifference extends TinyTypeOf<number>() {
  public readonly kind = "rank";
}

export class SuitDifference extends TinyType {
  public readonly kind = "suit";
  constructor(public readonly rank: Rank, public readonly difference: number) {
    super()
  }
}