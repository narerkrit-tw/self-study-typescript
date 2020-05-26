import { Do } from "fp-ts-contrib/lib/Do"
import * as M from "fp-ts/lib/Monoid"
import * as Opt from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import { Ordering } from "fp-ts/lib/Ordering"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import CommunityCards from "src/game/CommunityCards"
import Hand from "src/game/Hand"
import { TinyType } from "tiny-types"
import { Kicker } from "../Kicker"
import { ComboBase } from "./ComboBase"
import { Pair } from "./Pair"

export class TwoPair extends TinyType implements ComboBase<TwoPair> {
  kind: "TwoPair";
  comboRank: 2;
  private constructor(public readonly highPairRank: Rank, public readonly lowPairRank: Rank, public readonly highPairCards: [Card, Card], public readonly lowPairCards: [Card, Card], public readonly kicker: Kicker) {
    super()
  }
  compare(that: TwoPair): Ordering {
    return TwoPair.IsOrd.compare(this, that)
  }
  
  static fromCards(cards: Nea<Card>): Opt.Option<TwoPair> {
    return Do(Opt.option)
      .bind("highPair", Pair.fromCards(cards))
      .bindL("c1", ({ highPair }) => NEA.fromReadonlyArray(highPair.kicker.cards))
      .bindL("lowPair", ({ c1 }) => Pair.fromCards(c1))
      .return(({ highPair, lowPair }) => new TwoPair(highPair.pairRank, lowPair.pairRank, highPair.cards, lowPair.cards, lowPair.kicker))
  }
  static fromHandAndCommunityCards(h: Hand, cc: CommunityCards): Opt.Option<TwoPair> {
    return TwoPair.fromCards(NEA.concat(h.cards, cc.cards))
  }

  static IsOrd = M.fold(Ord.getMonoid<TwoPair>())([
    Ord.contramap((t: TwoPair) => t.highPairRank)(Rank.IsBounded),
    Ord.contramap((t: TwoPair) => t.lowPairRank)(Rank.IsBounded),
    Ord.contramap((t: TwoPair) => t.kicker)(Kicker.IsOrd),
  ])
}
