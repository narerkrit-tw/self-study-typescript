import * as Eq from "fp-ts/lib/Eq"
import * as M from "fp-ts/lib/Monoid"
import * as Ord from "fp-ts/lib/Ord"
import { pipe } from "fp-ts/lib/pipeable"
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
    return this.rank.equals(that.rank)
  }

  static IsEq = Eq.fromEquals<Card>( (c1, c2) => c1.equals(c2))
  
  static OrdByRank = Ord.contramap( (c: Card) => c.rank)(Rank.IsBounded)
  static OrdByRankReverse = Ord.getDualOrd(Card.OrdByRank)

  static OrdByRankSuit: Ord.Ord<Card> = 
    M.fold(Ord.getMonoid<Card>())([
      Card.OrdByRank, 
      pipe(
        Suit.IsBounded,
        Ord.contramap((c: Card) => c.suit)
    )])

  static OrdByRankSuitReverse = Ord.getDualOrd(Card.OrdByRankSuit)
}

