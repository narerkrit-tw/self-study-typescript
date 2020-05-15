import { Do } from "fp-ts-contrib/lib/Do"
import * as Fn from "fp-ts/lib/function"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as S from "fp-ts/lib/State"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"
import { Func } from "src/misc/Func"
import { TinyType } from "tiny-types"

type Draw<A> = S.State<Deck, A>;
type DrawCards = Draw<ReadonlyArray<Card>>;
type DrawNothing = Draw<void>;

type CardsAndDeck = [ReadonlyArray<Card>, Deck];

export default class Deck extends TinyType {

  private constructor(private readonly cards: ReadonlyArray<Card>) {
    super()
  }

  private transform(fn: (c: ReadonlyArray<Card>) => ReadonlyArray<Card>): Deck {
    return new Deck(fn(this.cards))
  }

  count(): number {
    return this.cards.length
  }

  drawN(n: number): CardsAndDeck {
    const intN = Math.floor(n)
    return [RA.takeLeft(intN)(this.cards), this.transform(RA.dropLeft(intN))]
  }

  drawOne(): CardsAndDeck {
    return this.drawN(1)
  }

  burnOne(): Deck {
    return this.transform(RA.dropLeft(1))
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

    const cards = Do(RA.readonlyArray)
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
  .bind("cards", drawOne)
  .do(burn)
  .return((ctx) => ctx.cards)

function joinCardDraws(s1: DrawCards, s2: DrawCards): DrawCards {
  return Do(S.state)
    .bind("a", s1)
    .bind("b", s2)
    .return(({ a, b }) => a.concat(b))
}

const drawBurnN: Func<number, DrawCards> = (n) => {
  return RA.range(1, n)
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
