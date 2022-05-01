import _shuffle from "lodash/shuffle";
import _last from "lodash/last";

import Card from "./Card";
import { Suit, Rank, GameState, SimpleGameState, PileGroupName } from "./types";

export const suits = [Suit.Spade, Suit.Heart, Suit.Diamond, Suit.Club];
export const ranks = [
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
    Rank.King,
];

export const cardCount: number = suits.length * ranks.length;

export const createNewStack = (): Card[] => {
    const stack = suits
        .map((suit) => ranks.map((rank) => new Card(suit, rank)))
        .flat();
    return _shuffle(stack);
};

export const createStateFromSimpleState = (simpleState: SimpleGameState) =>
    (
        Object.entries(simpleState) as [PileGroupName, Card[][]][]
    ).reduce<GameState>(
        (newState, [pileGroup, piles]) => ({
            ...newState,
            [pileGroup]: piles.map((pile, index) => ({
                cards: pile,
                index,
            })),
        }),
        { stock: [], waste: [], tableau: [], foundation: [] },
    );

// For testing purposes
export const createSolvedState = (): GameState => {
    const stack = createNewStack();
    const revealedStack: Card[] = stack.map((card) => {
        card.reveal();
        return card;
    });

    const state: GameState = createStateFromSimpleState({
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
            revealedStack.slice(21),
        ],
    });

    return state;
};

export const createInitialState = (): GameState => {
    const stack = createNewStack();

    const state: GameState = createStateFromSimpleState({
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
            stack.slice(21, 28),
        ],
    });

    for (const pile of state.tableau) {
        const lastCard = _last(pile.cards);
        if (lastCard) {
            lastCard.reveal();
        }
    }

    return state;
};
