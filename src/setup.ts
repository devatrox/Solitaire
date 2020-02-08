import _flatten from 'lodash/flatten';
import _shuffle from 'lodash/shuffle';
import _last from 'lodash/last';
import Card from './Card';
import { Suit, Rank, GameState } from './definitions';

const suits = [
    Suit.Spade,
    Suit.Heart,
    Suit.Diamond,
    Suit.Club
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

const cardCount: number = suits.length * ranks.length;

const createNewStack = (): Card[] => {
    const stack = _flatten(suits.map((suit) => ranks.map((rank) => new Card(suit, rank))));
    return _shuffle(stack);
};

// For testing purposes
const createSolvedState = (): GameState => {
    const stack = createNewStack();
    const revealedStack: Card[] = stack.map((card) => {
        card.reveal();
        return card;
    });

    const state: GameState = {
        stock: [[]],
        waste: [[]],
        foundation: [[], [], [], []],
        tableau: [
            revealedStack.slice(0, 1),
            revealedStack.slice(1, 3),
            revealedStack.slice(3, 6),
            revealedStack.slice(6, 10),
            revealedStack.slice(10, 15),
            revealedStack.slice(15, 21),
            revealedStack.slice(21)
        ]
    };

    return state;
};

const createInitialState = (): GameState => {
    const stack = createNewStack();

    const state: GameState = {
        stock: [stack.slice(28)],
        waste: [[]],
        foundation: [[], [], [], []],
        tableau: [
            stack.slice(0, 1),
            stack.slice(1, 3),
            stack.slice(3, 6),
            stack.slice(6, 10),
            stack.slice(10, 15),
            stack.slice(15, 21),
            stack.slice(21, 28)
        ]
    };

    for (const pile of state.tableau) {
        const lastCard = _last(pile);
        if (lastCard) {
            lastCard.reveal();
        }
    }

    return state;
};

export {
    suits,
    ranks,
    cardCount,
    createInitialState,
    createSolvedState
};
