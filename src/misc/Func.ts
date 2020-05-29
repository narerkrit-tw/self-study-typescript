export interface Func<S, T> {
  (s: S): T
}

export interface Func2<S1, S2, T> {
  (s1: S1, s2: S2): T
}