import { Ordering } from "fp-ts/lib/Ordering"

export interface  ComboBase<T extends ComboBase<T>> {
  readonly kind: string;
  readonly comboRank: number;

  compare(that: T): Ordering;
}