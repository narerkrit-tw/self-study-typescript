import { ReadonlyNonEmptyArray } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import { TinyType } from "tiny-types"

export default class Hand extends TinyType {
  private constructor(
    public readonly cards: ReadonlyNonEmptyArray<Card>
  ) {
    super()
  }

  static of(c1: Card, c2: Card): Hand {
    return new Hand([c1, c2])
  }
}