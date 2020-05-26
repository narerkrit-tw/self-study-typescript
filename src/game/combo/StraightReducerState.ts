import { pipe } from "fp-ts/lib/pipeable"
import * as A from "fp-ts/lib/ReadonlyArray"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import Rank from "src/card/Rank"

export class StraightReducerState {
  constructor(
    public readonly cards: Nea<Card>, 
    public readonly topCard: Card,
    private readonly previousCard: Card) {
  }
  private isNextRank(c: Card): boolean {
    const prevRank = this.previousCard.rank
    const isNextLowerRank = c.rank.diff(prevRank) === -1
    if(prevRank.equals(Rank.V2))
      return c.rank.equals(Rank.A) || isNextLowerRank
    else return isNextLowerRank
  }
  private isSameRank = (c: Card): boolean => c.rank.diff(this.previousCard.rank) === 0;
  private addCard = (c: Card): StraightReducerState => {
    const newCards = pipe(this.cards, a => NEA.cons(c, a), A.takeLeft(5))
    return new StraightReducerState(newCards as Nea<Card>, this.topCard, c)
  }
  apply(card: Card): StraightReducerState {
    if(this.isComplete() || this.isSameRank(card)){
      return this
    } else if(this.isNextRank(card)){
       return this.addCard(card)
    } else {
      return StraightReducerState.of(card)
    }
  }
  isIncomplete = (): boolean => !this.isComplete()
  isComplete(): boolean {
    return this.cards.length === 5
  }
  static of = (c: Card): StraightReducerState => new StraightReducerState([c], c, c);
}
