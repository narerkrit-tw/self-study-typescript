import * as M from "fp-ts/lib/Monoid"
import * as Opt from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import { Ordering } from "fp-ts/lib/Ordering"
import { pipe } from "fp-ts/lib/pipeable"
import * as A from "fp-ts/lib/ReadonlyArray"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import { Func } from "src/misc/Func"
import { TinyType } from "tiny-types"
import { Kicker } from "../Kicker"
import { ComboBase } from "./ComboBase"
import { StraightReducerState } from "./StraightReducerState"


export class Straight extends TinyType implements ComboBase<Straight> {
  kind: "Straight"
  comboRank: 4
  private constructor(public readonly topCardRank: Rank, public readonly cards: Nea<Card>, public readonly kicker: Kicker) {
    super()
  }
  compare(that: Straight): Ordering {
    return Straight.IsOrd.compare(this, that)
  }

  static IsOrd: Ord.Ord<Straight> = M.fold(Ord.getMonoid<Straight>())([
    Ord.contramap((s: Straight) => s.topCardRank)(Rank.IsBounded),
    Ord.contramap((h: Straight) => h.kicker)(Kicker.IsOrd),
  ]);

  static fromCards(cards: Nea<Card>): Opt.Option<Straight> {

    const copyAcesToTail: Func<Nea<Card>, Nea<Card>> = cards => {
      const aces = A.takeLeftWhile<Card>(c => c.rank.equals(Rank.A))(cards)
      return NEA.concat(cards, aces)
    }
    const sorted = pipe(
      cards,
      NEA.sort(Card.OrdByRankSuitReverse),
      copyAcesToTail
    )
    const reducer = StraightReducerState.of(NEA.head(sorted))
    const finalState = A.reduce<Card, StraightReducerState>(reducer, (r, c) => r.apply(c))(NEA.tail(sorted))
    if (finalState.isComplete()) {
      const kicker = Kicker.of(A.difference(Card.IsEq)(cards, finalState.cards))
      const rank = finalState.topCard.rank
      const comboCards = finalState.cards
      return Opt.some(new Straight(rank, comboCards, kicker))
    } else {
      return Opt.none
    }
  }
}
