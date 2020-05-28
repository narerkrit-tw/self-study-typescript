import * as Opt from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import { pipe } from "fp-ts/lib/pipeable"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"
import Card from "src/card/Card"
import CommunityCards from "../CommunityCards"
import Hand from "../Hand"
import Pair from "./Pair"
import Straight from "./Straight"
import TwoPair from "./TwoPair"
import HighCard from "./HighCard"

export type Combo = HighCard | Pair | TwoPair | Straight
export const ComboIsOrd = Ord.fromCompare<Combo>( (a, b) => a.compareCombo(b))
export const ComboSemigroupGreater = Sg.getJoinSemigroup<Combo>(ComboIsOrd)

export const  fromCards = (cards: Nea<Card> ): Combo => {
  const loaders: Nea< (_: Nea<Card>) => Opt.Option<Combo> > = [
    Straight.fromCards,
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