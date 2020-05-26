import { HighCard } from "./HighCard"
import { Pair } from "./Pair"
import { Straight } from "./Straight"
import { TwoPair } from "./TwoPair"

export type Combo = HighCard | Pair | TwoPair | Straight;

// export const ComboIsOrd = M.fold(Ord.getMonoid<Combo>())([
//   Ord.contramap((c: Combo) => c.comboRank)( Ord.ordNumber),
// ])



