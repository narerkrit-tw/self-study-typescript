import * as M from "fp-ts/lib/Monoid"
import * as Opt from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import { Ordering } from "fp-ts/lib/Ordering"
import { pipe } from "fp-ts/lib/pipeable"
import * as A from "fp-ts/lib/ReadonlyArray"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import ComboBase from "src/game/combo/ComboBase"
import CommunityCards from "src/game/CommunityCards"
import Hand from "src/game/Hand"
import Kicker from "src/game/combo/Kicker"
import { Combo } from "./Combo"

export default class HighCard extends ComboBase {
  kind: "HighCard";
  comboRank: 0;
  
  constructor(public readonly card: Card, public readonly kicker: Kicker) {
    super("HighCard", 0)
  }
  
  compare(that: HighCard): Ordering {
    return HighCard.IsOrd.compare(this, that)
  }

  compareCombo(that: Combo): Ordering {
    if(that instanceof HighCard){
      return this.compare(that)
    } else {
      return this.compareRank(that)
    }
  }
  
  static fromHandAndCommunityCards(h: Hand, cc: CommunityCards): HighCard {
    return this.fromCards(NEA.concat(h.cards, cc.cards))
  }
  static fromCards(cards: Nea<Card>): HighCard {
    const highestCard = NEA.max(Card.OrdByRankSuit)(cards)
    const kicker = pipe(cards, NEA.filter<Card>(x => !x.equals(highestCard)), Opt.fold(() => A.empty, nea => nea as ReadonlyArray<Card>), Kicker.of)
    return new HighCard(highestCard, kicker)
  }
  static IsOrd: Ord.Ord<HighCard> = M.fold(Ord.getMonoid<HighCard>())([
    Ord.contramap((h: HighCard) => h.card)(Card.OrdByRank),
    Ord.contramap((h: HighCard) => h.kicker)(Kicker.IsOrd),
  ]);
}