import Rank from "src/card/Rank"
import Suit from "src/card/Suit"
import { TinyType } from "tiny-types"
import { CardComparison, RankDifference, SuitDifference } from "./CardComparison"

export default class Card extends TinyType {
  static of(rank: Rank, suit: Suit): Card {
    return new Card(rank, suit)
  }

  private constructor(
    public readonly rank: Rank, 
    public readonly suit: Suit) {
    super()
  }

  compare(that: Card): CardComparison {
    if (this.sameRankAs(that))
      return new SuitDifference(this.rank, this.suit.diff(that.suit))
    else 
      return new RankDifference(this.rank.diff(that.rank))
  }

  sameSuitAs(that: Card): boolean {
    return this.suit.equals(that.suit)
  }

  sameRankAs(that: Card): boolean {
    return this.rank === that.rank
  }
}

