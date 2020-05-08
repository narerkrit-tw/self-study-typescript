import { Bounded } from "fp-ts/lib/Bounded"
import { ord, ordNumber } from "fp-ts/lib/Ord"
import { TinyType } from "tiny-types"

export default class Suit extends TinyType {
  private constructor(
    public readonly name: string,
    public readonly order: number
  ) {
    super()
  }
  diff(that: Suit): number {
    return this.order - that.order
  }
  static Club = new Suit("Club", 1)
  static Diamond = new Suit("Diamond", 2)
  static Heart = new Suit("Heart", 3)
  static Spade = new Suit("Spade", 4)
  static All = [Suit.Club, Suit.Diamond, Suit.Heart, Suit.Spade]

  static IsBounded: Bounded<Suit> = {
    ... ord.contramap(ordNumber, (s: Suit) => s.order),
    top: Suit.Club,
    bottom: Suit.Spade,
  }
}
