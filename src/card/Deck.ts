import { Do } from "fp-ts-contrib/lib/Do"
import * as A from "fp-ts/lib/Array"
import * as Fn from "fp-ts/lib/function"
import * as S from "fp-ts/lib/State"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"

type Draw<A> = S.State<Deck, A>;
type DrawCards = Draw<Array<Card>>;
type DrawNothing = Draw<void>;

type CardsAndDeck = [Array<Card>, Deck];

interface Func<S, T> {
  (s: S): T;
}

export default class Deck {
  private cards: Card[];

  private constructor(cards: Card[]) {
    this.cards = cards
  }

  private transform(fn: (c: Card[]) => Card[]): Deck {
    return new Deck(fn(this.cards))
  }

  count(): number {
    return this.cards.length
  }

  drawN(n: number): CardsAndDeck {
    const intN = Math.floor(n)
    return [A.takeLeft(intN)(this.cards), this.transform(A.dropLeft(intN))]
  }

  drawOne(): CardsAndDeck {
    return this.drawN(1)
  }

  burnOne(): Deck {
    return this.transform(A.dropLeft(1))
  }

  shuffled(genRandom: () => number = Math.random): Deck {
    return this.transform((cs) =>
      cs
        .map((c) => ({ sort: genRandom(), value: c }))
        .sort((a, b) => a.sort - b.sort)
        .map((o) => o.value)
    )
  }

  static freshFromPack(): Deck {
    const ranks = Rank.All
    const suits = Suit.All

    const cards = Do(A.array)
      .bind("s", suits)
      .bind("r", ranks)
      .return(({ r, s }) => Card.of(r, s))
    return new Deck(cards)
  }
}

const drawN: Func<number, DrawCards> = (n) => (d) => d.drawN(n)

const drawOne: DrawCards = drawN(1)

const burn: DrawNothing = S.modify((d) => d.burnOne())

const drawBurnOne: DrawCards = Do(S.state)
  .bind("d", drawOne)
  .bind("x", burn)
  .return((ctx) => ctx.d)

function joinCardDraws(s1: DrawCards, s2: DrawCards): DrawCards {
  return Do(S.state)
    .bind("a", s1)
    .bind("b", s2)
    .return(({ a, b }) => a.concat(b))
}

const drawBurnN: Func<number, DrawCards> = (n) => {
  return A.range(1, n)
    .map(Fn.constant(drawBurnOne))
    .reduce(joinCardDraws, S.state.of([] as Array<Card>))
}

const shuffle: DrawNothing = S.modify((d) => d.shuffled())

export const DeckOps = {
  drawN,
  drawOne,
  burn,
  drawBurnOne,
  drawBurnN,
  shuffle,
}
