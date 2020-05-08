import * as arr from "fp-ts/lib/Array"
import * as fn from "fp-ts/lib/function"
import Rank from "src/card/Rank"


function testDiff(r1: Rank, r2: Rank, expectedDiff: number): void {
  expect(r1.diff(r2)).toEqual(expectedDiff)
}

describe("Rank", () => {
  it("should diff", () => {
    [
      [Rank.A, Rank.V5, 9],
      [Rank.K, Rank.K, 0],
      [Rank.V3, Rank.V9, -6]
    ].forEach(fn.tupled(testDiff))
  })
  it("should be Ordered", () => {
    const reversed = arr.reverse(Rank.All)
    expect(reversed).not.toEqual(Rank.All)
    expect(arr.sort(Rank.IsBounded)(reversed)).toEqual(Rank.All)
  })
})