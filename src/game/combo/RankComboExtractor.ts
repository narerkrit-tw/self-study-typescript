import { flow } from "fp-ts/lib/function"
import * as Opt from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import { pipe } from "fp-ts/lib/pipeable"
import * as A from "fp-ts/lib/ReadonlyArray"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Sg from "fp-ts/lib/Semigroup"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import { Func } from "src/misc/Func"


export type RankCombo = {
  size: number;
  comboCards: Nea<Card>;
  rank: Rank;
}

const RankComboOrd = Ord.contramap((r: RankCombo) => r.rank)(Rank.IsBounded)
const RankComboSemigroupMax = Sg.getJoinSemigroup(RankComboOrd)

const extractRankCombo = (size: number) => (cards: Nea<Card>): Opt.Option<RankCombo> => {
  const firstCard = NEA.head(cards)
  if (cards.length >= size && cards.every(c => firstCard.sameRankAs(c))) {
      const comboCards = A.takeLeft(size)(cards) as Nea<Card>
      const rank = NEA.head(comboCards).rank
      return Opt.some({size, comboCards, rank })
  }
  else {
    return Opt.none
  }
}

const optToA = <T>(o: Opt.Option<T>): ReadonlyArray<T> => pipe(
  o,
  Opt.fold(() => A.empty, A.of)
)

export const makeRankCombo = <C>(sizeNum: number, buildCombo: Func<RankCombo, C>)=> (cards: Nea<Card>): Opt.Option<C> => {
  const size = Math.floor(sizeNum)
  const cardGroups = NEA.groupSort(Card.OrdByRank)(cards)
  const combos = pipe(
    cardGroups,
    A.chain(flow(extractRankCombo(size), optToA))
  )
  const result = A.foldMap(Opt.getMonoid(RankComboSemigroupMax))((r: RankCombo) => Opt.some(r))(combos)
  return Opt.map(buildCombo)(result)
}

