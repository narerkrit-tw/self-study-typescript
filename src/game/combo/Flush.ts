
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
import { makeSuitCombo, SuitCombo } from "./ComboExtractor"
import Kicker from "./Kicker"


export default class Flush extends ComboBase {
  
  kind: "Flush";
  comboRank: 5;
  
  constructor(public readonly highCardRank: Rank, public readonly cards: Nea<Card>, public readonly kicker: Kicker) {
    super("Flush", 5)
  }
  
  compare(that: Flush): Ordering {
    return Flush.IsOrd.compare(this, that)
  }

  compareCombo(that: Combo): Ordering {
    if(that instanceof Flush){
      return this.compare(that)
    } else {
      return this.compareRank(that)
    }
  }

  static fromCards(allCards: Nea<Card>): Opt.Option<Flush> {

    const buildFlush = (rc: SuitCombo): Flush => {
      const topCardRank = rc.topCardRank
      const rest = A.difference(Card.IsEq)(allCards, rc.comboCards)
      return new Flush(topCardRank, rc.comboCards, Kicker.of(rest))
    }

    return makeSuitCombo(buildFlush)(allCards)
  }
  
  static IsOrd: Ord.Ord<Flush> = fold(Ord.getMonoid<Flush>())([
    Ord.contramap((p: Flush) => p.highCardRank)(Rank.IsBounded),
    Ord.contramap((p: Flush) => p.kicker)(Kicker.IsOrd)
  ])

  static SemigroupMax = Sg.getJoinSemigroup(Flush.IsOrd)
}
