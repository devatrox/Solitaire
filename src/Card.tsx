import _noop from 'lodash/noop';
import { Suit, Rank, Color } from './definitions';

interface CardInterface {
    suit: Suit
    rank: Rank
    isRevealed: boolean
    color: Color
}

class Card implements CardInterface {
    color: Color = Color.BLACK

    constructor(public suit: Suit, public rank: Rank, public isRevealed: boolean = false) {
        if (this.suit === Suit.Diamond || this.suit === Suit.Heart) {
            this.color = Color.RED;
        }
    }

    get id() {
        return this.suit + this.rank;
    }

    get symbol() {
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
    }
}

export default Card;
