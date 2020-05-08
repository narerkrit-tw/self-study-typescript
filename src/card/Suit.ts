import { Bounded } from "fp-ts/lib/Bounded"
import { ord, ordNumber } from "fp-ts/lib/Ord"
import { TinyType } from "tiny-types"

type SuitName = "club" | "diamond" | "heart" | "spade"

export default class Suit extends TinyType {
  private constructor(
    public readonly name: SuitName,
    public readonly order: number
  ) {
    super()
  }
  diff(that: Suit): number {
    return this.order - that.order
  }
  static Club = new Suit("club", 1)
  static Diamond = new Suit("diamond", 2)
  static Heart = new Suit("heart", 3)
  static Spade = new Suit("spade", 4)
  static All = [
    Suit.Club, 
    Suit.Diamond, 
    Suit.Heart, 
    Suit.Spade
  ]

  static IsBounded: Bounded<Suit> = {
    ... ord.contramap(ordNumber, (s: Suit) => s.order),
    top: Suit.Club,
    bottom: Suit.Spade,
  }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function match(s: Suit): string {
  switch (s.name) {
    case "club": return  "it is a club"
    case "diamond": return "tis a diamond"
    case "heart": return "here lies a heart"
    case "spade": return "look, a spade"
    // case "other": return "this doesn't belong"
  }
}
