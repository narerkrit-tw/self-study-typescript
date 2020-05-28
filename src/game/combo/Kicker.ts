import * as O from "fp-ts/lib/Ord"
import { ord, Ord } from "fp-ts/lib/Ord"
import { Ordering } from "fp-ts/lib/Ordering"
import * as A from "fp-ts/lib/ReadonlyArray"
import Card from "src/card/Card"
import { OrdSortedHL } from "src/misc/CustomOrds"
import { TinyType } from "tiny-types"

export default class Kicker extends TinyType {

  private constructor(
    public readonly cards: ReadonlyArray<Card>
  ) {
    super()
  }

  compare(that: Kicker): Ordering {
    return Kicker.IsOrd.compare(this, that)
  }

  isHigherThan(that: Kicker): boolean {
    return O.gt(Kicker.IsOrd)(this, that)
  }

  isLowerThan(that: Kicker): boolean {
    return O.lt(Kicker.IsOrd)(this, that)
  }

  static of = (cards: ReadonlyArray<Card>): Kicker => new Kicker(A.sort(Card.OrdByRank)(cards));
  static empty = Kicker.of([])
  static IsOrd: Ord<Kicker> = ord.contramap(OrdSortedHL(Card.OrdByRank), (k: Kicker) => k.cards)
}