import { Card } from './Card';

enum Suit {
    Spade = 'A',
    Heart = 'B',
    Diamond = 'C',
    Club = 'D'
}

enum Rank {
    Ace = '1',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = 'A',
    Jack = 'B',
    Knight = 'C',
    Queen = 'D',
    King = 'E',
    Joker = 'F'
}

type AppState = {
    stock: Card[][],
    waste: Card[][],
    foundation: Card[][],
    tableau: Card[][],

}

type CardProps = {
    card: Card,
    style?: React.CSSProperties,
    onClick?: (event: React.SyntheticEvent, card: Card) => void,
    onDrop?: (event: React.DragEvent<HTMLDivElement>, card: Card) => void
}

type PileProps = {
    cards: Card[],
    onDrag?: (event: React.SyntheticEvent) => void,
    onClick?: (event: React.SyntheticEvent, card: Card) => void,
    onDrop?: (event: React.DragEvent<HTMLDivElement>, card: Card) => void
}

type GroupProps = {
    piles: Card[][],
    onDrag?: (event: React.SyntheticEvent) => void,
    onClick?: (event: React.SyntheticEvent, card: Card) => void,
    onDrop?: (event: React.DragEvent<HTMLDivElement>, card: Card) => void
}

type Pile = 'stock' | 'waste' | 'foundation' | 'tableau';

type Color = 'red' | 'black';

enum ActionTypes {
    MOVE_CARDS = 'move-cards',
    FLIP_CARD = 'flip-card',
    FLIP_CARDS = 'flip-cards',
    RESET = 'reset'
};

type ActionPayload = {
    source?: [Pile, number, Card[] | Card],
    target: [Pile, number, Card?],

}

type Action = {
    type: ActionTypes,
    payload: ActionPayload,

}

export {
    AppState,
    Suit,
    Rank,
    Pile,
    Color,
    PileProps,
    GroupProps,
    CardProps,
    ActionPayload,
    ActionTypes,
    Action
}
