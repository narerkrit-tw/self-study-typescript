import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray as Nea } from "fp-ts/lib/ReadonlyNonEmptyArray"
import Card from "src/card/Card"
import Rank from "src/card/Rank"
import Suit from "src/card/Suit"
import { fromCards } from "src/game/combo/Combo"
import HighCard from "src/game/combo/HighCard"
import Pair from "src/game/combo/Pair"
import Straight from "src/game/combo/Straight"
import TwoPair from "src/game/combo/TwoPair"

type NeaCard = Nea<Card>

const ASpade = Card.of(Rank.A, Suit.Spade)
const AHeart = Card.of(Rank.A, Suit.Heart)

const pairA = [ASpade, AHeart] as NeaCard

const JClub = Card.of(Rank.J, Suit.Club)
const JDiamond = Card.of(Rank.J, Suit.Diamond)

const pairJ = [JClub, JDiamond] as NeaCard

const SevenClub = Card.of(Rank.V7, Suit.Club)
const SixClub = Card.of(Rank.V6, Suit.Club)
const FiveClub = Card.of(Rank.V5, Suit.Club)
const FourClub = Card.of(Rank.V4, Suit.Club)
const ThreeClub = Card.of(Rank.V3, Suit.Club)

const straight7 = [SevenClub, SixClub, FiveClub, FourClub, ThreeClub] as NeaCard


describe("creating combo from cards", () => {
  it("should return combo", () => {
    expect(fromCards([SixClub, ThreeClub])).toBeInstanceOf(HighCard)
    expect(fromCards(pairJ)).toBeInstanceOf(Pair)
    expect(fromCards(NEA.concat(pairA, pairJ))).toBeInstanceOf(TwoPair)
    expect(fromCards(straight7)).toBeInstanceOf(Straight)
  })

  it("should return highest combo when multiple kind is possible", () => {
    const cards = [pairJ, pairA, straight7].reduce(NEA.concat)
    expect(fromCards(cards)).toBeInstanceOf(Straight)
  })
})