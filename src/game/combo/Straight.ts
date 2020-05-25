import * as Opt from "fp-ts/lib/Option"
import * as A from "fp-ts/lib/ReadonlyArray"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import { TinyType } from "tiny-types"
import { Kicker } from "../Kicker"
import { ComboBase } from "./ComboBase"
import { StraightReducerState } from "./StraightReducerState"

export class Straight extends TinyType implements ComboBase {
  kind: "Straight";
  comboRank: 4;
  private constructor(public readonly topCardRank: Rank, public readonly cards: Nea<Card>, public readonly kicker: Kicker) {
    super()
  }
  static fromCards(cards: Nea<Card>): Opt.Option<Straight> {
    const sorted = NEA.sort(Card.OrdByRankSuit)(cards)
    const reducer = StraightReducerState.of(NEA.head(sorted))
    const finalState = A.reduce<Card, StraightReducerState>(reducer, (r, c) => r.apply(c))(NEA.tail(sorted))
    if (finalState.isComplete()) {
      const kicker = Kicker.of(A.difference(Card.IsEq)(cards, finalState.cards))
      const rank = finalState.previousCard.rank
      const comboCards = finalState.cards
      return Opt.some(new Straight(rank, comboCards, kicker))
    }
    else {
      return Opt.none
    }
  }
}
