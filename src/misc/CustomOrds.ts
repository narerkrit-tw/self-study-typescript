import { getDualOrd, Ord, ord } from "fp-ts/lib/Ord"
import * as A from "fp-ts/lib/ReadonlyArray"

export function OrdSortedHL<T>(o: Ord<T>): Ord<ReadonlyArray<T>> {
  const sortArray = A.sort(getDualOrd(o))
  const ordArr = A.getOrd(o)
  return ord.contramap(ordArr, sortArray)
}
