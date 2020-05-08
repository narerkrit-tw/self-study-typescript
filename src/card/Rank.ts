import { Bounded } from "fp-ts/lib/Bounded"
import { ord, ordNumber } from "fp-ts/lib/Ord"
import { TinyType } from "tiny-types"

export default class Rank extends TinyType {
  
  static V2 = new Rank(2)
  static V3 = new Rank(3)
  static V4 = new Rank(4)
  static V5 = new Rank(5)
  static V6 = new Rank(6)
  static V7 = new Rank(7)
  static V8 = new Rank(8)
  static V9 = new Rank(9)
  static V10 = new Rank(10)
  static J = new Rank(11)
  static Q = new Rank(12)
  static K = new Rank(13)
  static A = new Rank(14)

  private constructor(
    public readonly innateValue: number
  ) {
    super()
  }

  diff(that: Rank): number {
    return this.innateValue - that.innateValue
  }

  static IsBounded: Bounded<Rank> = {
    ... ord.contramap(ordNumber, x => x.innateValue),
    top: Rank.A,
    bottom: Rank.V2
  }
}