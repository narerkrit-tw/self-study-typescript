import { pipe } from "fp-ts/lib/pipeable"
import * as A from "fp-ts/lib/ReadonlyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"

export class StraightReducerState {
  constructor(public readonly cards: Nea<Card>, public readonly previousCard: Card) {
  }
  private isNextRank = (c: Card): boolean => c.rank.diff(this.previousCard.rank) === 1;
  private isSameRank = (c: Card): boolean => c.rank.diff(this.previousCard.rank) === 0;
  private addCard = (c: Card): StraightReducerState => {
    const newCards = pipe(this.cards, a => A.cons(c, a), A.takeLeft(5))
    return new StraightReducerState(newCards as Nea<Card>, c)
  };
  apply(card: Card): StraightReducerState {
    if (this.isNextRank(card))
      return this.addCard(card)
    else if (this.isSameRank(card))
      return this
    else
      return StraightReducerState.of(card)
  }
  isComplete(): boolean {
    return this.cards.length === 5
  }
  static of = (c: Card): StraightReducerState => new StraightReducerState([c], c);
}
