import { BoxProps } from "@theme-ui/components";
import Card, { CardInterface } from "./Card";

export enum Suit {
    Spade = "spade",
    Heart = "heart",
    Diamond = "diamond",
    Club = "club",
}

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

export enum PileName {
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

export type CardClickEvent = (
    event: React.SyntheticEvent,
    card: Card,
    source: [PileName, number],
) => void;

export type PileClickEvent = (
    event: React.SyntheticEvent,
    name: PileName,
) => void;

export type DropEvent = (
    event: React.DragEvent<HTMLDivElement>,
    target: [PileName, number],
) => void;

export type MenuEvent = (event: React.SyntheticEvent) => void;

export interface GameState {
    stock: Card[][];
    waste: Card[][];
    foundation: Card[][];
    tableau: Card[][];
}

export interface GenericPileProps extends Omit<BoxProps, "onDrop" | "onClick"> {
    name: PileName;
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
    source: [PileName, number];
};

export type MappedCard = [Card, number, number];

export type ActionPayloadSourceName = PileName;

export type ActionPayloadTargetName = PileName;

export type ActionPayload = {
    cards: MappedCard[];
    sourcePile?: ActionPayloadSourceName;
    targetPile: ActionPayloadTargetName;
};

export type Action = {
    type: ActionTypes;
    payload?: ActionPayload;
};
