import { ordNumber } from "fp-ts/lib/Ord"
import { Ordering } from "fp-ts/lib/Ordering"
import { TinyType } from "tiny-types"
import { Combo } from "./Combo"

export default abstract class ComboBase extends TinyType {
  public readonly kind: string;
  public readonly comboRank: number;

  abstract compareCombo(c: Combo): Ordering

  constructor(kind: string, comboRank: number){
    super()
    this.kind = kind
    this.comboRank = comboRank
  }

  compareRank(that: ComboBase): Ordering {
    return ordNumber.compare(this.comboRank, that.comboRank)
  }
}