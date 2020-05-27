import { fold } from "fp-ts/lib/Monoid"
import * as Opt from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import { Ordering } from "fp-ts/lib/Ordering"
import * as A from "fp-ts/lib/ReadonlyArray"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import { Combo } from "src/game/combo/Combo"
import CommunityCards from "src/game/CommunityCards"
import Hand from "src/game/Hand"
import Kicker from "../Kicker"
import ComboBase from "./ComboBase"


export default class Pair extends ComboBase {
  
  kind: "Pair";
  comboRank: 1;
  
  constructor(public readonly pairRank: Rank, public readonly cards: [Card, Card], public readonly kicker: Kicker) {
    super("Pair", 1)
  }
  
  compare(that: Pair): Ordering {
    return Pair.IsOrd.compare(this, that)
  }

  compareCombo(that: Combo): Ordering {
    if(that instanceof Pair){
      return this.compare(that)
    } else {
      return this.compareRank(that)
    }
  }

  static fromCards(allCards: Nea<Card>): Opt.Option<Pair> {
    const makePair = (sameRankCards: Nea<Card>): Opt.Option<Pair> => {
      const firstCard = NEA.head(sameRankCards)
      if (sameRankCards.length >= 2 &&
        sameRankCards.every(c => firstCard.sameRankAs(c))) {
          const cardPair = A.takeLeft(2)(sameRankCards)
          const [c1, c2] = cardPair
          const pairRank = NEA.head(sameRankCards).rank
          const rest = A.difference(Card.IsEq)(allCards, cardPair)
          const pair = new Pair(pairRank, [c1, c2], Kicker.of(rest))
          return Opt.some(pair)
      }
      else {
        return Opt.none
      }
    }
    const rankGroups = NEA.groupSort(Card.OrdByRankReverse)(allCards)
    const result = A.readonlyArray.foldMap(Opt.getFirstMonoid<Pair>())(rankGroups, makePair)
    return result
  }
  
  static fromHandAndCommunityCards(h: Hand, cc: CommunityCards): Opt.Option<Pair> {
    return this.fromCards(NEA.concat(h.cards, cc.cards))
  }
  
  static IsOrd: Ord.Ord<Pair> = fold(Ord.getMonoid<Pair>())([
    Ord.contramap((p: Pair) => p.pairRank)(Rank.IsBounded),
    Ord.contramap((p: Pair) => p.kicker)(Kicker.IsOrd)
  ])
}
