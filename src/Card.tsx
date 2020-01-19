import _noop from 'lodash/noop';
import { Suit, Rank, Color } from './definitions';

interface CardInterface {
    suit: Suit;
    rank: Rank;
    isRevealed: boolean;
    color?: Color;
    id?: string;
    symbol?: string;
}

class Card implements CardInterface {
    constructor(public suit: Suit, public rank: Rank, public isRevealed: boolean = false) { }

    get color(): Color {
        if (this.suit === Suit.Diamond || this.suit === Suit.Heart) {
            return Color.RED;
        }

        return Color.BLACK;
    }

    get id(): string {
        return this.suit + this.rank;
    }

    get symbol(): string {
        return String.fromCodePoint(Number('0x0001F0' + this.id));
    }

    static fromJSON(json: CardInterface): Card {
        return new Card(json.suit, json.rank, json.isRevealed);
    }

    static fromString = (jsonString: string): Card => {
        try {
            const json = JSON.parse(jsonString);
            return Card.fromJSON(json);
        } catch (e) {
            throw new Error(e);
        }
    };
}

export default Card;
export {
    CardInterface
};
