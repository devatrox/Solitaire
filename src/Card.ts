import { current, immerable, produce } from "immer";
import { Suit, Rank, Color, SvgRankName } from "./types";

export type SvgID = `SvgCards__${Suit}_${SvgRankName}`;

interface CardInterface {
    suit: Suit;
    rank: Rank;
    isRevealed: boolean;
    color: Color;
    id: SvgID;
}

const names: SvgRankName[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "jack",
    "queen",
    "king",
];

class Card implements CardInterface {
    [immerable] = true;

    constructor(
        public suit: Suit,
        public rank: Rank,
        public isRevealed: boolean = false,
    ) {
        this.suit = suit;
        this.rank = rank;
        this.isRevealed = isRevealed;
    }

    get color(): Color {
        if (this.suit === Suit.Diamond || this.suit === Suit.Heart) {
            return Color.RED;
        }

        return Color.BLACK;
    }

    get id(): SvgID {
        return `SvgCards__${this.suit}_${names[this.rank - 1]}`;
    }

    reveal() {
        this.isRevealed = true;
        // return produce(this, (draft) => {
        //     draft.isRevealed = true;
        // });
    }

    hide() {
        this.isRevealed = false;
        // return produce(this, (draft) => {
        //     draft.isRevealed = false;
        // });
    }

    flip() {
        this.isRevealed = !this.isRevealed;
        // return produce(this, (draft) => {
        //     draft.isRevealed = !draft.isRevealed;
        // });
    }

    static fromJSON({ suit, rank, isRevealed }: CardInterface) {
        return new Card(suit, rank, isRevealed);
    }

    static fromString = (jsonString: string): Card => {
        try {
            const json = JSON.parse(jsonString);
            return Card.fromJSON(json);
        } catch (e: any) {
            throw new Error(e);
        }
    };
}

export default Card;
export { CardInterface };
