import { flow, Predicate } from "fp-ts/lib/function"
import * as Opt from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import { pipe } from "fp-ts/lib/pipeable"
import * as A from "fp-ts/lib/ReadonlyArray"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"
import { optToArr } from "src/misc/Converters"
import { Func, Func2 } from "src/misc/Func"


export type RankCombo = {
  size: number
  comboCards: Nea<Card>
  rank: Rank
}

export type SuitCombo = {
  comboCards: Nea<Card>
  topCardRank: Rank
}

const RankComboOrd = Ord.contramap((r: RankCombo) => r.rank)(Rank.IsBounded)
const RankComboSemigroupMax = Sg.getJoinSemigroup(RankComboOrd)

const SuitComboOrd = Ord.contramap((r: SuitCombo) => r.topCardRank)(Rank.IsBounded)
const SuitComboSemigroupMax = Sg.getJoinSemigroup(SuitComboOrd)

const extract = <A>(predicate: Predicate<Nea<Card>>, makeCombo: Func2<Nea<Card>, Rank, A>) => (size: number) => (cards: Nea<Card>): Opt.Option<A> => {
  const predicateResult = cards.length >= size && predicate(cards)
  if(predicateResult) {
    const comboCards = pipe(
      cards,
      NEA.sort(Card.OrdByRankSuitReverse),
      A.takeLeft(size)
    ) as Nea<Card>
    const rank = NEA.max(Card.OrdByRankSuit)(comboCards).rank
    return Opt.some(makeCombo(comboCards, rank))
  } else {
    return Opt.none
  }
}

const extractRankCombo = extract<RankCombo>( cs => {
  const firstCard = NEA.head(cs)
  return cs.every(c => firstCard.sameRankAs(c))
}, (comboCards, rank) => ({
  size: comboCards.length,
  comboCards,
  rank,
}))

const extractSuitCombo = extract<SuitCombo>( cs => {
  const firstCard = NEA.head(cs)
  return cs.every(c => firstCard.sameSuitAs(c))
}, (comboCards, topCardRank) => ({
  comboCards,
  topCardRank
}))

export const makeRankCombo = <C>(sizeNum: number, buildCombo: Func<RankCombo, C>)=> (cards: Nea<Card>): Opt.Option<C> => {
  const size = Math.floor(sizeNum)
  const cardGroups = NEA.groupSort(Card.OrdByRank)(cards)
  const combos = pipe(
    cardGroups,
    A.chain(flow(extractRankCombo(size), optToArr))
  )
  const result = A.foldMap(Opt.getMonoid(RankComboSemigroupMax))((r: RankCombo) => Opt.some(r))(combos)
  return Opt.map(buildCombo)(result)
}

export const makeSuitCombo = <C>(buildCombo: Func< SuitCombo, C>) => (cards: Nea<Card>): Opt.Option<C> => {
  const cardGroups = pipe(
    cards,
    NEA.groupSort(Ord.contramap((c: Card) => c.suit)(Suit.IsBounded)),
  ) as readonly Nea<Card>[]

  const combos = pipe(cardGroups,
    A.chain(flow(extractSuitCombo(5), optToArr))
  )

  const result = A.foldMap(Opt.getMonoid(SuitComboSemigroupMax))((r: SuitCombo) => Opt.some(r))(combos)
  return Opt.map(buildCombo)(result)
}

