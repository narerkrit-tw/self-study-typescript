import * as A from "fp-ts/lib/Array"
import "jest-extended"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"


describe("card", () => {
  const AHeart = Card.of(Rank.A, Suit.Heart)
  const ADiamond = Card.of(Rank.A, Suit.Diamond)

  const QHeart = Card.of(Rank.Q, Suit.Heart)
  const QClub = Card.of(Rank.Q, Suit.Club)
  const SixClub = Card.of(Rank.V6, Suit.Club)

  it("should check equality based on rank and suit", () => {
    const c1 = Card.of(Rank.V7, Suit.Diamond)
    const c2 = Card.of(Rank.V7, Suit.Diamond)

    expect(c1.equals(c2)).toBeTrue()
    expect(c1.equals(ADiamond)).toBeFalse()
    expect(AHeart.equals(ADiamond)).toBeFalse()
    
  })
  it("should order by rank", () => {
    const cards = [AHeart, QHeart, QClub, SixClub]
    const result = A.sort(Card.OrdByRank)(cards)
    expect(result).toEqual([SixClub, QHeart, QClub, AHeart])
  })
  it("should order by rank, reverse", () => {
    const cards = [SixClub, QClub, QHeart, AHeart]
    const result = A.sort(Card.OrdByRankReverse)(cards)
    expect(result).toEqual([AHeart, QClub, QHeart, SixClub])
  })
  it("should order by rank and suit", () => {
    const cards = [QClub, QHeart, AHeart, ADiamond, SixClub]
    const result = A.sort(Card.OrdByRankSuit)(cards)
    expect(result).toEqual([SixClub, QClub, QHeart, ADiamond, AHeart])
  })
  it("should order by rank and suit, reverse", () => {
    const cards = [QClub, QHeart, AHeart, ADiamond, SixClub]
    const result = A.sort(Card.OrdByRankSuitReverse)(cards)
    expect(result).toEqual([AHeart, ADiamond, QHeart, QClub, SixClub])
  })
})