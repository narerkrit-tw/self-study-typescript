import Card from "src/card/Card"
import { TinyType } from "tiny-types"

import { ReadonlyNonEmptyArray } from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as A from "fp-ts/lib/ReadonlyNonEmptyArray"


export class Hand extends TinyType {
  private constructor(
    public readonly cards: ReadonlyNonEmptyArray<Card>
  ) {
    super()
  }

  static of(c1: Card, c2: Card): Hand {
    return new Hand([c1, c2])
  }
}

export class CommunityCards extends TinyType {
  private constructor(
    public readonly cards: ReadonlyNonEmptyArray<Card>
  ) {
    super()
  }

  add(c: Card): CommunityCards {
    return new CommunityCards( A.snoc(this.cards, c))
  }

  static flop(c1: Card, c2: Card, c3: Card): CommunityCards {
    return new CommunityCards([c1, c2, c3])
  }
}