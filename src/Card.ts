import {
    Suit, Rank, Color
} from './definitions';

interface CardInterface {
    suit: Suit;
    rank: Rank;
    isRevealed: boolean;
    color?: Color;
    id?: string;
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
        const names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];

        return `${this.suit}_${names[this.rank - 1]}`;
    }

    reveal(): void {
        this.isRevealed = true;
    }

    hide(): void {
        this.isRevealed = false;
    }

    flip(): void {
        this.isRevealed = !this.isRevealed;
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
