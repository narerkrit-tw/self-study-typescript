import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import "jest-extended"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"
import { HighCard } from "src/game/Combo"


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
  pending("should pick any high card when multiple card of same rank are available")
  pending("should compare with another high card combo based on the high card first")
  pending("should compare based on kicker cards if high card is same rank")
})