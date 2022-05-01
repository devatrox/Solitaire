import Card, { CardInterface } from "./Card";

export enum Suit {
    Spade = "spade",
    Heart = "heart",
    Diamond = "diamond",
    Club = "club",
}

export type SvgRankName =
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "jack"
    | "queen"
    | "king";

export enum Rank {
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
    Joker = 14,
}

export enum PileGroupName {
    STOCK = "stock",
    WASTE = "waste",
    FOUNDATION = "foundation",
    TABLEAU = "tableau",
}

export enum Color {
    RED = "red",
    BLACK = "black",
}

export enum ActionTypes {
    MOVE_CARDS = "move-cards",
    RESET = "reset",
    FLIP_CARD = "flip-card",
    FINISH = "finish",
}

export type CardClickEvent<T = HTMLDivElement> = (
    event: React.SyntheticEvent<T>,
    card: Card,
    source: [PileGroupName, number],
) => void;

export type PileClickEvent<T = HTMLDivElement> = (
    event: React.SyntheticEvent<T>,
    name: PileGroupName,
) => void;

export type DropEvent<T = HTMLDivElement> = (
    event: React.DragEvent<T>,
    target: [PileGroupName, number],
) => void;

export type PileType = {
    cards: Card[];
    index: number;
};

export type PileGroupType = PileType[];

export type SimpleGameState = {
    [key in PileGroupName]: Card[][];
};

export type GameState = {
    [key in PileGroupName]: PileGroupType;
};

export interface GenericPileProps {
    name: PileGroupName;
    stackDown?: boolean;
    onCardClick?: CardClickEvent;
    onCardDoubleClick?: CardClickEvent;
    onDrop?: DropEvent;
}

export type ValidationResult = {
    status: boolean;
    statusText: string;
};

export type CardTransferObject = {
    cards: CardInterface[];
    source: [PileGroupName, number];
};

export type MappedCard = [Card, number, number];

export type ActionPayloadSourceName = PileGroupName;

export type ActionPayloadTargetName = PileGroupName;

export type ActionPayload = {
    cards: MappedCard[];
    sourcePile?: ActionPayloadSourceName;
    targetPile: ActionPayloadTargetName;
};

export type Action = {
    type: ActionTypes;
    payload?: ActionPayload;
};
