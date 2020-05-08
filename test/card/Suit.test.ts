import * as arr from "fp-ts/lib/Array"
import Suit from "src/card/Suit"

describe("suit", () => {
  it("should diff", () => {
    expect(Suit.Spade.diff(Suit.Club)).toBe(3)
    expect(Suit.Diamond.diff(Suit.Spade)).toBe(-2)
  })

  it("should be Ordered", () => {
    const unsorted = arr.reverse(Suit.All)
    expect(arr.sort(Suit.IsBounded)(unsorted))
      .toEqual(Suit.All)
  })
})