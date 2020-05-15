import * as Opt from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"
import * as A from "fp-ts/lib/ReadonlyArray"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import CommunityCards from "src/game/CommunityCards"
import Hand from "src/game/Hand"
import { TinyType } from "tiny-types"
import { Kicker } from "./Kicker"



export type Combo = HighCard | Pair

interface ComboBase {
  readonly kind: string;
  readonly comboRank: number;
}

export class HighCard extends TinyType implements ComboBase {
  kind: "HighCard"
  comboRank: 1
  
  constructor(
    public readonly card: Card,
    public readonly kicker: Kicker,
  ) {
    super()
  }

  static fromHandAndCommunityCards(h: Hand, cc: CommunityCards): HighCard {
    return this.fromCards( NEA.concat(h.cards, cc.cards))
  }

  static fromCards(cards: Nea<Card>): HighCard {
    const highestCard = NEA.max(Card.OrdByRank)(cards)

    const kicker = pipe(
      cards,
      NEA.filter<Card>(x => !x.equals(highestCard)),
      Opt.fold(() => A.empty, nea => nea as ReadonlyArray<Card>),
      Kicker.of
    )
    return new HighCard(highestCard, kicker)
  }
}

export class Pair extends TinyType {
  kind: "Pair"
  comboRank: 2

  private constructor(
    public readonly pairRank: Rank,
    public readonly cards: [Card, Card],
    public readonly kicker: Kicker
  ) {
    super()
  }

  static fromCards(allCards: Nea<Card>): Opt.Option<Pair> {

    const makePair = (sameRankCards: Nea<Card>): Opt.Option<Pair> => {
      const firstCard = NEA.head(sameRankCards)
      if(
        sameRankCards.length >= 2 && 
        sameRankCards.every(c => firstCard.sameRankAs(c))) {
        const cardPair = A.takeLeft(2)(sameRankCards)
        const [c1, c2] = cardPair
        const pairRank = NEA.head(sameRankCards).rank
        const rest = A.difference(Card.IsEq)(allCards, cardPair)
        const pair = new Pair(pairRank, [c1, c2],  Kicker.of(rest))
        return Opt.some(pair)
      } else {
        return Opt.none
      }
    }

    const rankGroups = NEA.groupSort(Card.OrdByRankReverse)(allCards)
    const result =  A.readonlyArray.foldMap(Opt.getFirstMonoid<Pair>())(rankGroups, makePair)
    return result
  }

  static fromHandAndCommunityCards(h: Hand, cc: CommunityCards): Opt.Option<Pair> {
    return this.fromCards( NEA.concat(h.cards, cc.cards))
  }
}
