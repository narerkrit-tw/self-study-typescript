import * as Ord from "fp-ts/lib/Ord"
import HighCard from "./HighCard"
import Pair from "./Pair"
import Straight from "./Straight"
import TwoPair from "./TwoPair"

export type Combo = HighCard | Pair | TwoPair | Straight
export const ComboIsOrd = Ord.fromCompare<Combo>( (a, b) => a.compareCombo(b))



