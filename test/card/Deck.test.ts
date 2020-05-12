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

  it("should draw cards", () => {
    const deck = Deck.freshFromPack()
    const drawnCards = deck.drawN(52)[0]
    const firstDrawnCard = drawnCards[0]
    const secondDrawnCard = drawnCards[1]
    const lastDrawnCard = drawnCards[51]

    expect(firstDrawnCard).toEqual(twoOfClub)
    expect(secondDrawnCard).toEqual(threeOfClub)
    expect(lastDrawnCard).toEqual(aceOfSpade)
  })

  it("should burn a card", () => {
    const deck = Deck.freshFromPack()
    const burntDeck = deck.burnOne()
    expect(burntDeck.count()).toEqual(51)
  })
})

describe("deck ops", () => {
  it("should draw cards", () => {
    const draw10 = DeckOps.drawN(10)
    const deck = Deck.freshFromPack()
    const finalState = S.execState(draw10, deck)
    const result = S.evalState(draw10, deck)
    expect(finalState.count()).toEqual(42)
    expect(result.length).toEqual(10)
  })
  it("should drawn and burn single card", () => {
    const drawAndBurn = DeckOps.drawBurnOne
    const deck = Deck.freshFromPack()
    const finalState = S.execState(drawAndBurn, deck)
    const result = S.evalState(drawAndBurn, deck)
    expect(finalState.count()).toEqual(50)
    expect(result.length).toEqual(1)
  })
  it("should draw and burn multiple cards", () => {
    const drawBurn3 = DeckOps.drawBurnN(3)
    const deck = Deck.freshFromPack()
    const finalState = S.execState(drawBurn3, deck)
    const result = S.evalState(drawBurn3, deck)
    expect(finalState.count()).toEqual(52 - 6)
    expect(result.length).toEqual(3)
    expect(result[0]).toEqual(twoOfClub)
    // 3 of club should be burnt
    expect(result[1]).toEqual(Card.of(Rank.V4, Suit.Club))
    expect(result[2]).toEqual(Card.of(Rank.V6, Suit.Club))
  })
})