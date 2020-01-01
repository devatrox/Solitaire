import _flatten from 'lodash/flatten';
import _shuffle from 'lodash/shuffle';
import _last from 'lodash/last';
import { Card } from './Card';
import { Suit, Rank, AppState } from './definitions';

const suits = [
    Suit.Spade,
    Suit.Heart,
    Suit.Diamond,
    Suit.Club,
];
const ranks = [
    Rank.Ace,
    Rank.Two,
    Rank.Three,
    Rank.Four,
    Rank.Five,
    Rank.Six,
    Rank.Seven,
    Rank.Eight,
    Rank.Nine,
    Rank.Ten,
    Rank.Jack,
    Rank.Queen,
    Rank.King
];

const stack = _flatten(suits.map(suit => ranks.map(rank => new Card(suit, rank))));

const getInitialState = (): AppState => {
    console.log('init')
    const shuffledCards = _shuffle(stack);

    const state: AppState = {
        stock: [shuffledCards.slice(28)],
        waste: [[]],
        foundation: [[], [], [], []],
        tableau: [
            shuffledCards.slice(0, 1),
            shuffledCards.slice(1, 3),
            shuffledCards.slice(3, 6),
            shuffledCards.slice(6, 10),
            shuffledCards.slice(10, 15),
            shuffledCards.slice(15, 21),
            shuffledCards.slice(21, 28)
        ]
    }

    for (let pile of state.tableau) {
        const lastCard = _last(pile);
        if (lastCard) {
            lastCard.revealed = true;
        }
    }

    return state;
}

export {
    getInitialState
}
