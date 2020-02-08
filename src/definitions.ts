import Card, { CardInterface } from './Card';

enum Suit {
    Spade = 'spade',
    Heart = 'heart',
    Diamond = 'diamond',
    Club = 'club'
}

enum Rank {
    Ace = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    Joker = 14
}

enum PileName {
    STOCK = 'stock',
    WASTE = 'waste',
    FOUNDATION = 'foundation',
    TABLEAU = 'tableau'
}

enum Color {
    RED = 'red',
    BLACK = 'black'
}

enum ActionTypes {
    MOVE_CARDS = 'move-cards',
    RESET = 'reset',
    FLIP_CARD = 'flip-card',
    FINISH = 'finish'
}

type GameState = {
    stock: Card[][];
    waste: Card[][];
    foundation: Card[][];
    tableau: Card[][];
};

type GameProps = {
    initialState: GameState;
};

type CardProps = {
    card: Card;
    source: [PileName, number];
    isTop?: boolean;
    isBottom?: boolean;
    isStackDown?: boolean;
    childCards?: Card[];
    style?: React.CSSProperties;
    children?: JSX.Element;
    key?: string;
    onClick?: (event: React.SyntheticEvent, card: Card, source: [PileName, number]) => void;
    onDoubleClick?: (event: React.SyntheticEvent, card: Card, source: [PileName, number]) => void;
    onDrop?: (event: React.DragEvent<HTMLDivElement>, target: [PileName, number]) => void;
};

type PileProps = {
    cards: Card[];
    name: PileName;
    stackDown?: boolean;
    index?: number;
    onClick?: (event: React.SyntheticEvent, name: PileName) => void;
    onCardClick?: (event: React.SyntheticEvent, card: Card, source?: [PileName, number]) => void;
    onCardDoubleClick?: (event: React.SyntheticEvent, card: Card, source: [PileName, number]) => void;
    onDrop?: (event: React.DragEvent<HTMLDivElement>, target: [PileName, number]) => void;
};

type GroupProps = {
    piles: Card[][];
    name: PileName;
    stackDown?: boolean;
    onPileClick?: (event: React.SyntheticEvent, name: PileName) => void;
    onCardClick?: (event: React.SyntheticEvent, card: Card, source?: [PileName, number]) => void;
    onCardDoubleClick?: (event: React.SyntheticEvent, card: Card, source: [PileName, number]) => void;
    onDrop?: (event: React.DragEvent<HTMLDivElement>, target: [PileName, number]) => void;
};

type MenuProps = {
    message: string;
    isDone: boolean;
    isFinished: boolean;
    onFinish?: (event: React.SyntheticEvent) => void;
    onReset?: (event: React.SyntheticEvent) => void;
};

type ValidationResult = {
    status: boolean;
    statusText: string;
};

type CardTransferObject = {
    cards: CardInterface[];
    source: [PileName, number];
};

type MappedCard = [Card, number, number];

type ActionPayloadSourceName = PileName;

type ActionPayloadTargetName = PileName;

type ActionPayload = {
    cards: MappedCard[];
    sourcePile?: ActionPayloadSourceName;
    targetPile: ActionPayloadTargetName;
};

type Action = {
    type: ActionTypes;
    payload?: ActionPayload;

};

export {
    GameState,
    GameProps,
    Suit,
    Rank,
    PileName,
    Color,
    PileProps,
    GroupProps,
    MenuProps,
    CardProps,
    ValidationResult,
    CardTransferObject,
    MappedCard,
    ActionPayload,
    ActionPayloadSourceName,
    ActionPayloadTargetName,
    ActionTypes,
    Action
};
