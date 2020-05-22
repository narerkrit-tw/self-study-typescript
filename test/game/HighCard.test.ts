import * as Ord from "fp-ts/lib/Ord"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import "jest-extended"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"
import { HighCard } from "src/game/Combo"
import { Kicker } from "src/game/Kicker"


type NEACard = NEA.ReadonlyNonEmptyArray<Card>

describe("combo: high card", () => {
  const AHeart = Card.of(Rank.A, Suit.Heart)
  const ADiamond = Card.of(Rank.A, Suit.Diamond)

  const QHeart = Card.of(Rank.Q, Suit.Heart)
  const QClub = Card.of(Rank.Q, Suit.Club)
  const SixClub = Card.of(Rank.V6, Suit.Club)
  it("should pick the highest ranking card", () => {
    const cards = [QHeart, AHeart, SixClub] as NEACard
    const result = HighCard.fromCards(cards)
    expect(result.card).toEqual(AHeart)
    expect(result.kicker.cards).toIncludeSameMembers([QHeart, SixClub])
  })
  it("should pick high card with higher suit when multiple card of same rank are available", () => {
    const cards = [QClub, QHeart, SixClub] as NEACard
    const result = HighCard.fromCards(cards)
    expect(result.card).toEqual(QHeart)
    expect(result.kicker.cards).toIncludeSameMembers([QClub, SixClub])
  })
  it("should compare with another high card combo based on the high card rank", () => {
    const hc1 = new HighCard(AHeart, Kicker.empty)
    const hc2 = new HighCard(QClub, Kicker.empty)
    expect(Ord.gt(HighCard.IsOrd)(hc1, hc2)).toBeTrue()
    expect(Ord.gt(HighCard.IsOrd)(hc2, hc1)).toBeFalse()
  })
  it("should compare based on kicker cards if high card is same rank", () => {
    const hc1 = new HighCard(AHeart, Kicker.of([SixClub]))
    const hc2 = new HighCard(ADiamond, Kicker.of([QClub]))
    expect(Ord.gt(HighCard.IsOrd)(hc1, hc2)).toBeFalse()
    expect(Ord.gt(HighCard.IsOrd)(hc2, hc1)).toBeTrue()
  })

  it("should compare to equal if high card and kicker ranks are the same", () => {
    const hc1 = new HighCard(AHeart, Kicker.of([QClub]))
    const hc2 = new HighCard(ADiamond, Kicker.of([QHeart]))
    expect(HighCard.IsOrd.equals(hc1, hc2)).toBeTrue()
  })
})