import * as Opt from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import { pipe } from "fp-ts/lib/pipeable"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"
import Card from "src/card/Card"
import CommunityCards from "src/game/CommunityCards"
import Hand from "src/game/Hand"
import HighCard from "./HighCard"
import Pair from "./Pair"
import Straight from "./Straight"
import ThreeOfAKind from "./ThreeOfAKind"
import TwoPair from "./TwoPair"
import Flush from "./Flush"

export type Combo = HighCard | Pair | TwoPair | ThreeOfAKind | Straight | Flush
export const ComboIsOrd = Ord.fromCompare<Combo>( (a, b) => a.compareCombo(b))
export const ComboSemigroupGreater = Sg.getJoinSemigroup<Combo>(ComboIsOrd)

export const fromCards = (cards: Nea<Card> ): Combo => {
  const loaders: Nea< (_: Nea<Card>) => Opt.Option<Combo> > = [
    Flush.fromCards,
    Straight.fromCards,
    ThreeOfAKind.fromCards,
    TwoPair.fromCards,
    Pair.fromCards,
  ]
  const monoid = Opt.getMonoid<Combo>(ComboSemigroupGreater)
  
  return pipe(
    loaders,
    NEA.map(fn => fn(cards)),
    NEA.fold(monoid),
    Opt.getOrElse(() => HighCard.fromCards(cards))
  )
}

export const fromHandAndCommunityCard = 
  (h: Hand, cc: CommunityCards): Combo => fromCards(NEA.concat(h.cards, cc.cards))