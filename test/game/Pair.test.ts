import * as Opt from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import "jest-extended"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"
import { Pair } from "src/game/Combo"


type NEACard = NEA.ReadonlyNonEmptyArray<Card>

describe("pair combo", () => {

  const ASpade = Card.of(Rank.A, Suit.Spade)
  const AClub = Card.of(Rank.A, Suit.Club)
  const AHeart = Card.of(Rank.A, Suit.Heart)
  const ADiamond = Card.of(Rank.A, Suit.Diamond)

  const QHeart = Card.of(Rank.Q, Suit.Heart)
  const QClub = Card.of(Rank.Q, Suit.Club)
  const SixClub = Card.of(Rank.V6, Suit.Club)

  it("should return none when not enough cards", () => {
    const cards = NEA.of(ASpade)
    expect(Pair.fromCards(cards)).toBe(Opt.none)
  })
  it("should return none when no 2 cards of same rank", () => {
    const cards = [ASpade, QHeart, SixClub] as NEACard
    const result = Pair.fromCards(cards)
    expect(result).toBe(Opt.none)
  })

  it("should create from pair of card from same rank", () => {
    const cards = [ASpade, AHeart, QHeart, SixClub] as NEACard
    const result = pipe(cards, Pair.fromCards, Opt.toNullable)
    expect(result).not.toBeNull
    expect(result.pairRank).toEqual(Rank.A)
    expect(result.kicker.cards).toIncludeSameMembers([QHeart, SixClub])
    expect(result.cards).toIncludeSameMembers([ASpade, AHeart])
  })

  it("should return pair of highest rank, when multiple pair combos available", () => {
    const cards = [SixClub, QHeart, QClub, ASpade, AHeart] as NEACard
    const result = pipe(cards, Pair.fromCards, Opt.toNullable)
    expect(result).not.toBeNull
    expect(result.pairRank).toEqual(Rank.A)
    expect(result.cards).toIncludeSameMembers([ASpade, AHeart])
    expect(result.kicker.cards).toIncludeSameMembers([QHeart, QClub, SixClub])
  })
  it("should return pair of any 2 cards when more than 2 cards of same rank available", () => {
    const cards = [ASpade, AHeart, AClub, ADiamond, SixClub] as NEACard
    const result = pipe(cards, Pair.fromCards, Opt.toNullable)
    expect(result).not.toBeNull
    expect(result.pairRank).toEqual(Rank.A)
    expect(result.cards).toHaveLength(2)
    expect(result.kicker.cards).toHaveLength(3)
  })
})