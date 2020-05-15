import { Do } from "fp-ts-contrib/lib/Do"
import * as S from "fp-ts/lib/State"
import Card from "src/card/Card"
import Deck, { DeckOps } from "src/card/Deck"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"

const twoOfClub = Card.of(Rank.V2, Suit.Club)
const threeOfClub = Card.of(Rank.V3, Suit.Club)
const aceOfSpade = Card.of(Rank.A, Suit.Spade)

describe("deck", () => {
  it("should create fresh pack", () => {
    const result = Deck.freshFromPack()
    expect(result.count()).toEqual(52)
  })

  it("should equal based on cards", () => {
    const d1 = Deck.freshFromPack()
    const d2 = Deck.freshFromPack()
    expect(d1).toEqual(d2)
  })

  it("should draw cards", () => {
    const deck = Deck.freshFromPack()
    const [drawnCards, remaining] = deck.drawN(52)
    const [firstDrawnCard, secondDrawnCard] = drawnCards
    const lastDrawnCard = drawnCards[51]

    expect(firstDrawnCard).toEqual(twoOfClub)
    expect(secondDrawnCard).toEqual(threeOfClub)
    expect(lastDrawnCard).toEqual(aceOfSpade)
    expect(remaining.count()).toEqual(0)
  })

  it("should burn a card", () => {
    const deck = Deck.freshFromPack()
    const burntDeck = deck.burnOne()
    expect(burntDeck.count()).toEqual(51)
  })

  it("should shuffle", () => {
    const unshuffled = Deck.freshFromPack()
    const shuffled = unshuffled.shuffled()
    expect(shuffled.count()).toEqual(52)
    expect(unshuffled).not.toEqual(shuffled)
  })
})

describe("deck ops", () => {
  it("should draw cards", () => {
    const draw10 = DeckOps.drawN(10)
    const deck = Deck.freshFromPack()
    const [result, finalState] = draw10(deck)
    expect(finalState.count()).toEqual(42)
    expect(result.length).toEqual(10)
  })

  it("should draw as many as possible if not enough card left in deck", () => {
    const overdraw = Do(S.state)
      .do(DeckOps.drawN(52 - 2))
      .bind("result", DeckOps.drawN(4))
      .return(x => x.result)

    const [result, finalState] = overdraw(Deck.freshFromPack())
    expect(finalState.count()).toEqual(0)
    expect(result.length).toEqual(2)
  })
  
  it("should drawn and burn single card", () => {
    const drawAndBurn = DeckOps.drawBurnOne
    const deck = Deck.freshFromPack()
    const [result, finalState] = drawAndBurn(deck)
    expect(finalState.count()).toEqual(50)
    expect(result.length).toEqual(1)
  })
  it("should draw and burn multiple cards", () => {
    const drawBurn3 = DeckOps.drawBurnN(3)
    const deck = Deck.freshFromPack()
    const [result, finalState] = drawBurn3(deck)
    const [c1, c2, c3] = result
    expect(finalState.count()).toEqual(52 - 6)
    expect(result.length).toEqual(3)
    expect(c1).toEqual(twoOfClub)
    // 3 and 5 of club should be burnt
    expect(c2).toEqual(Card.of(Rank.V4, Suit.Club))
    expect(c3).toEqual(Card.of(Rank.V6, Suit.Club))
  })

  it("should shuffle", () => {
    const deck = Deck.freshFromPack()
    const shuffledDeck = S.execState(DeckOps.shuffle, deck)

    expect(shuffledDeck.count()).toEqual(52)
    expect(shuffledDeck).not.toEqual(deck)
  })
})