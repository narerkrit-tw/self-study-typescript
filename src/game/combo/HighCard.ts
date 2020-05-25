import * as M from "fp-ts/lib/Monoid"
import * as Opt from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import * as A from "fp-ts/lib/ReadonlyArray"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"

import { pipe } from "fp-ts/lib/pipeable"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import CommunityCards from "src/game/CommunityCards"
import Hand from "src/game/Hand"
import { TinyType } from "tiny-types"
import { Kicker } from "../Kicker"
import { ComboBase } from "./ComboBase"
export class HighCard extends TinyType implements ComboBase {
  kind: "HighCard";
  comboRank: 0;
  constructor(public readonly card: Card, public readonly kicker: Kicker) {
    super()
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
