import * as Opt from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import "jest-extended"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"
import ThreeOfAKind from "src/game/combo/ThreeOfAKind"


type NEACard = NEA.ReadonlyNonEmptyArray<Card>

describe("combo: three of a kind", () => {

  const ASpade = Card.of(Rank.A, Suit.Spade)
  const AClub = Card.of(Rank.A, Suit.Club)
  const AHeart = Card.of(Rank.A, Suit.Heart)
  const ADiamond = Card.of(Rank.A, Suit.Diamond)

  const QHeart = Card.of(Rank.Q, Suit.Heart)
  const QClub = Card.of(Rank.Q, Suit.Club)
  const QSpade = Card.of(Rank.Q, Suit.Spade)
  const SixClub = Card.of(Rank.V6, Suit.Club)

  it("should return none when not enough cards", () => {
    const cards = NEA.of(ASpade)
    expect(ThreeOfAKind.fromCards(cards)).toBe(Opt.none)
  })
  it("should return none when no 3 cards of same rank", () => {
    const cards = [ASpade, AClub, QHeart, SixClub] as NEACard
    const result = ThreeOfAKind.fromCards(cards)
    expect(result).toBe(Opt.none)
  })

  it("should create from ThreeOfAKind of card from same rank", () => {
    const cards = [ASpade, AHeart, ADiamond,  QHeart, SixClub] as NEACard
    const result = pipe(cards, ThreeOfAKind.fromCards, Opt.toNullable)
    expect(result).not.toBeNull()
    expect(result.rank).toEqual(Rank.A)
    expect(result.kicker.cards).toIncludeSameMembers([QHeart, SixClub])
    expect(result.cards).toIncludeSameMembers([ASpade, AHeart, ADiamond])
  })

  it("should return ThreeOfAKind of highest rank, when multiple ThreeOfAKind combos available", () => {
    const cards = [SixClub, QHeart, QClub, QSpade, AClub, ASpade, AHeart] as NEACard
    const result = pipe(cards, ThreeOfAKind.fromCards, Opt.toNullable)
    expect(result).not.toBeNull()
    expect(result.rank).toEqual(Rank.A)
    expect(result.cards).toIncludeSameMembers([ASpade, AHeart, AClub])
    expect(result.kicker.cards).toIncludeSameMembers([QHeart, QClub, QSpade, SixClub])
  })
  it("should return ThreeOfAKind of any 3 cards when more than 3 cards of same rank available", () => {
    const cards = [ASpade, AHeart, AClub, ADiamond, SixClub] as NEACard
    const result = pipe(cards, ThreeOfAKind.fromCards, Opt.toNullable)
    expect(result).not.toBeNull()
    expect(result.rank).toEqual(Rank.A)
    expect(result.cards).toHaveLength(3)
    expect(result.kicker.cards).toHaveLength(2)
  })
})