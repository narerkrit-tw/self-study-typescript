import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"
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


function tryPatternMatching(c: CardComparison): string {
  switch (c.kind) {
    case "rank":
      return `rank difference of ${c.value}`
    case "suit":
      return `suit difference of ${c.difference} at rank ${c.rank}`
  }
}

const AceOfSpade = Card.of(Rank.A, Suit.Spade)
const KingOfHeart = Card.of(Rank.K, Suit.Heart)
console.log(tryPatternMatching(AceOfSpade.compare(KingOfHeart)))
