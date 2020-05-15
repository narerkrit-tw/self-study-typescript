import * as O from "fp-ts/lib/Ord"
import { ordNumber } from "fp-ts/lib/Ord"
import * as A from "fp-ts/lib/ReadonlyArray"
import { OrdSortedHL } from "src/misc/CustomOrds"

describe("Ord array, sorted High-low", () => {

  const ordSortNum = OrdSortedHL(ordNumber)
  
  it("should return equal on empty array", () => {
    expect(ordSortNum.compare([], [])).toEqual(0)
  })
  it("should return equal on array of same elements", () => {
    const a1 = [1, 2, 3]
    const a2 = [2, 1, 3]
    expect(ordSortNum.compare(a1, a2)).toEqual(0)
  })
  it("should compare the arrays based on largest element", () => {
    const a1 = [5, 4, 3, 2]
    const a2 = [1, 0, 6]

    expect(ordSortNum.compare(a1, a2)).toEqual(-1)
    expect(ordSortNum.compare(a2, a1)).toEqual(1)
    expect(O.lt(ordSortNum)(a1, a2)).toBe(true)
    expect(O.gt(ordSortNum)(a2, a1)).toBe(true)
  })
  it("should compare based on second largest element if largest element is the same", () => {
    const a1 = [2, 3, 5]
    const a2 = [1, 4, 5]

    expect(ordSortNum.compare(a1, a2)).toEqual(-1)
    expect(ordSortNum.compare(a2, a1)).toEqual(1)

    expect(O.lt(ordSortNum)(a1, a2)).toBe(true)
  })

  it("should compare based on subsequent elements, in order of size", () => {
    const a1 = [5, 5, 4, 4, 3, 3, 1]
    const a2 = [5, 5, 4, 4, 3, 3, 2]

    expect(ordSortNum.compare(a1, a2)).toEqual(-1)
    expect(ordSortNum.compare(A.reverse(a1), A.reverse(a2))).toEqual(-1)
    expect(ordSortNum.compare(a2, a1)).toEqual(1)
  })

  it("should count as greater longer array with same high elements", () => {
    const a1 = [4, 3, 2]
    const a2 = [4, 3, 2, 1]

    expect(ordSortNum.compare(a1, a2)).toEqual(-1)
    expect(ordSortNum.compare(a2, a1)).toEqual(1)
  })
})