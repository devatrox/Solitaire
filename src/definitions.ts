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

type PileName = 'stock' | 'waste' | 'foundation' | 'tableau';

type Color = 'red' | 'black';

enum ActionTypes {
    MOVE_CARDS = 'move-cards',
    FLIP_CARD = 'flip-card',
    FLIP_CARDS = 'flip-cards',
    RESET = 'reset',
    REVEAL_CARD = 'reveal-card'
};

type AppState = {
    stock: Card[][],
    waste: Card[][],
    foundation: Card[][],
    tableau: Card[][],
}

type AppProps = {
    initialState: AppState
}

type CardProps = {
    card: Card,
    source: [PileName, number],
    style?: React.CSSProperties,
    onClick?: (event: React.SyntheticEvent, card: Card) => void,
    onDrop?: (event: React.DragEvent<HTMLDivElement>, target: [PileName, number]) => void
}

type PileProps = {
    cards: Card[],
    name: PileName,
    stackDown?: boolean,
    index?: number,
    onClick?: (event: React.SyntheticEvent, card: Card) => void,
    onDrop?: (event: React.DragEvent<HTMLDivElement>, target: [PileName, number]) => void
}

type GroupProps = {
    piles: Card[][],
    name: PileName,
    stackDown?: boolean,
    onClick?: (event: React.SyntheticEvent, card: Card) => void,
    onDrop?: (event: React.DragEvent<HTMLDivElement>, target: [PileName, number]) => void
}

type CardTransferObject = {
    card: Card,
    source: [PileName, number]
}

type ActionPayload = {
    source?: [PileName, number, Card[] | Card],
    target: [PileName, number, Card?],
}

type Action = {
    type: ActionTypes,
    payload: ActionPayload,

}

export {
    AppState,
    AppProps,
    Suit,
    Rank,
    PileName,
    Color,
    PileProps,
    GroupProps,
    CardProps,
    CardTransferObject,
    ActionPayload,
    ActionTypes,
    Action
}
