import * as Opt from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray } from "fp-ts/lib/ReadonlyNonEmptyArray"
import "jest-extended"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"
import { Straight } from "src/game/combo/Straight"

type NeaCard = ReadonlyNonEmptyArray<Card>

describe("combo - straight", () => {
  const ASpade = Card.of(Rank.A, Suit.Spade)
  const KHeart = Card.of(Rank.K, Suit.Heart)
  const QHeart = Card.of(Rank.Q, Suit.Heart)
  const JHeart = Card.of(Rank.J, Suit.Heart)
  const TenHeart = Card.of(Rank.V10, Suit.Heart)
  
  const highStraitCards = [ASpade, KHeart, QHeart, JHeart, TenHeart] as NeaCard
  
  const SixClub = Card.of(Rank.V6, Suit.Club)
  const FiveClub = Card.of(Rank.V5, Suit.Club)
  const FourClub = Card.of(Rank.V4, Suit.Club)
  const ThreeClub = Card.of(Rank.V3, Suit.Club)
  const TwoClub = Card.of(Rank.V2, Suit.Club)

  const lowStraitCards = [SixClub, FiveClub, FourClub, ThreeClub, TwoClub] as NeaCard
  const bottomStraightCards = [FiveClub, FourClub, ThreeClub, TwoClub, ASpade] as NeaCard
  it("should return none if not enough cards", () => {
    const cards = [ASpade] as NeaCard
    const result = Straight.fromCards(cards)
    expect(result).toBe(Opt.none)
  })
  it("should return none if cards do not form straight", () => {
    const cards = [ASpade, KHeart, QHeart, JHeart, FiveClub, FourClub] as NeaCard
    const result  = Straight.fromCards(cards)
    expect(result).toBe(Opt.none)
  })
  it("should return value if cards form straight of 5 cards", () => {
    const extras = [QHeart, TenHeart]
    const cards = NEA.concat(extras, lowStraitCards)
    const result = pipe(cards, Straight.fromCards, Opt.toNullable)
    expect(result).not.toBeNull()
    expect(result.topCardRank).toEqual(Rank.V6)
    expect(result.cards).toIncludeSameMembers(lowStraitCards.concat())
    expect(result.kicker.cards).toIncludeSameMembers(extras)
  })
  it("should include single card when multiple of same ranks in straight", () => {
    const extras = [Card.of(Rank.K, Suit.Diamond), Card.of(Rank.V10, Suit.Club)]
    const cards = NEA.concat(extras, highStraitCards)
    const result = pipe(cards, Straight.fromCards, Opt.toNullable)

    expect(result).not.toBeNull()
    expect(result.topCardRank).toEqual(Rank.A)
    expect(result.cards).toIncludeSameMembers(highStraitCards.concat())
    expect(result.kicker.cards).toIncludeSameMembers(extras)
  })
  it("should accept Ace as both highest or lowest card", () => {
    const extras = [JHeart, TenHeart]
    const cards = NEA.concat(extras, bottomStraightCards)
    const result = pipe(cards, Straight.fromCards, Opt.toNullable)

    expect(result).not.toBeNull()
    expect(result.topCardRank).toEqual(Rank.V5)
    expect(result.cards).toIncludeSameMembers(bottomStraightCards.concat())
    expect(result.kicker.cards).toIncludeSameMembers(extras)
  })
  it("should return highest possible straight if more than 5 cards consecutive", () => {
    const extras = [Card.of(Rank.V9, Suit.Club), Card.of(Rank.V8, Suit.Spade)]
    const cards = NEA.concat(highStraitCards, extras)
    
    const result = pipe(cards, Straight.fromCards, Opt.toNullable)
    expect(result).not.toBeNull()
    expect(result.topCardRank).toEqual(Rank.A)
    expect(result.cards).toIncludeSameMembers(highStraitCards.concat())
    expect(result.kicker.cards).toIncludeSameMembers(extras)
  })
  it("should return highest possible straight if two non-consecutive straights are possible", () => {
    const cards = NEA.concat(lowStraitCards, highStraitCards)

    const result = pipe(cards, Straight.fromCards, Opt.toNullable)
    expect(result).not.toBeNull()
    expect(result.topCardRank).toEqual(Rank.A)
    expect(result.cards).toIncludeSameMembers(highStraitCards.concat())
    expect(result.kicker.cards).toIncludeSameMembers(lowStraitCards.concat())
  })
})