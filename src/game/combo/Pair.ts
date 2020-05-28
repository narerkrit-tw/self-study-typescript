import { fold } from "fp-ts/lib/Monoid"
import * as Opt from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import { Ordering } from "fp-ts/lib/Ordering"
import * as A from "fp-ts/lib/ReadonlyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import { Combo } from "src/game/combo/Combo"
import ComboBase from "./ComboBase"
import Kicker from "./Kicker"
import { makeRankCombo, RankCombo } from "./RankComboExtractor"


export default class Pair extends ComboBase {
  
  kind: "Pair";
  comboRank: 1;
  
  constructor(public readonly pairRank: Rank, public readonly cards: [Card, Card], public readonly kicker: Kicker) {
    super("Pair", 1)
  }
  
  compare(that: Pair): Ordering {
    return Pair.IsOrd.compare(this, that)
  }

  compareCombo(that: Combo): Ordering {
    if(that instanceof Pair){
      return this.compare(that)
    } else {
      return this.compareRank(that)
    }
  }

  static fromCards(allCards: Nea<Card>): Opt.Option<Pair> {

    const buildPair = (rc: RankCombo): Pair => {
      const [c1, c2] = rc.comboCards
      const pairRank = rc.rank
      const rest = A.difference(Card.IsEq)(allCards, rc.comboCards)
      return new Pair(pairRank, [c1, c2], Kicker.of(rest))
    }

    return makeRankCombo(2, buildPair)(allCards)
  }
  
  static IsOrd: Ord.Ord<Pair> = fold(Ord.getMonoid<Pair>())([
    Ord.contramap((p: Pair) => p.pairRank)(Rank.IsBounded),
    Ord.contramap((p: Pair) => p.kicker)(Kicker.IsOrd)
  ])

  static SemigroupMax = Sg.getJoinSemigroup(Pair.IsOrd)
}
