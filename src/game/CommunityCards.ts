import * as A from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import { TinyType } from "tiny-types"

export default class CommunityCards extends TinyType {
  private constructor(public readonly cards: ReadonlyNonEmptyArray<Card>) {
    super()
  }
  add(c: Card): CommunityCards {
    return new CommunityCards(A.snoc(this.cards, c))
  }
  static flop(c1: Card, c2: Card, c3: Card): CommunityCards {
    return new CommunityCards([c1, c2, c3])
  }
}