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


export default class ThreeOfAKind extends ComboBase {
  
  kind: "ThreeOfAKind";
  comboRank: 3;
  
  constructor(public readonly rank: Rank, public readonly cards: [Card, Card, Card], public readonly kicker: Kicker) {
    super("ThreeOfAKind", 3)
  }
  
  compare(that: ThreeOfAKind): Ordering {
    return ThreeOfAKind.IsOrd.compare(this, that)
  }

  compareCombo(that: Combo): Ordering {
    if(that instanceof ThreeOfAKind){
      return this.compare(that)
    } else {
      return this.compareRank(that)
    }
  }

  static fromCards(allCards: Nea<Card>): Opt.Option<ThreeOfAKind> {

    const buildThreeOfAKind = (rc: RankCombo): ThreeOfAKind => {
      const [c1, c2, c3] = rc.comboCards
      const ThreeOfAKindRank = rc.rank
      const rest = A.difference(Card.IsEq)(allCards, rc.comboCards)
      return new ThreeOfAKind(ThreeOfAKindRank, [c1, c2, c3], Kicker.of(rest))
    }

    return makeRankCombo(3, buildThreeOfAKind)(allCards)
  }
  
  static IsOrd: Ord.Ord<ThreeOfAKind> = fold(Ord.getMonoid<ThreeOfAKind>())([
    Ord.contramap((p: ThreeOfAKind) => p.rank)(Rank.IsBounded),
    Ord.contramap((p: ThreeOfAKind) => p.kicker)(Kicker.IsOrd)
  ])

  static SemigroupMax = Sg.getJoinSemigroup(ThreeOfAKind.IsOrd)
}
