import * as A from "fp-ts/lib/ReadonlyArray"
import * as Opt from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"

export const optToArr = <T>(o: Opt.Option<T>): ReadonlyArray<T> => pipe(
  o,
  Opt.fold(() => A.empty, A.of)
)