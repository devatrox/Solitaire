import _last from "lodash/last";
import _first from "lodash/first";
import Card from "./Card";
import { PileGroupType, PileType, Rank, ValidationResult } from "./types";
import { ranks } from "./setup";

export const validResult = { status: true, statusText: "" };

export const genericError = {
    status: false,
    statusText: "Some error occurred",
};

export const MOVE_NOT_ALLOWED = "Move is not allowed";

export type CardRuleFn = (cards: Card[], pile: Card[]) => ValidationResult;

export const validateMultiple = (
    cards: Card[],
    pile: Card[],
    rules: CardRuleFn[],
): ValidationResult =>
    rules.reduce((result, rule) => {
        if (!result.status) {
            return result;
        }
        return rule(cards, pile);
    }, validResult);

export const isDifferentColor: CardRuleFn = (cards, pile) => {
    const topCard = _last(pile);
    const firstCard = _first(cards);
    if (!firstCard) {
        return genericError;
    }
    const result = !topCard || topCard.color !== firstCard.color;
    console.info("isDifferentColor", result);

    return {
        status: result,
        statusText: result ? "" : MOVE_NOT_ALLOWED,
    };
};

export const isHigherRank: CardRuleFn = (cards, pile) => {
    const topCard = _last(pile);
    const firstCard = _first(cards);
    if (!firstCard) {
        return genericError;
    }
    const result =
        !topCard ||
        ranks.indexOf(firstCard.rank) === ranks.indexOf(topCard.rank) - 1;
    console.info("isHigherRank", result);

    return {
        status: result,
        statusText: result ? "" : MOVE_NOT_ALLOWED,
    };
};

export const isLowerRank: CardRuleFn = (cards, pile) => {
    const firstCard = _first(cards);
    if (!firstCard) {
        return genericError;
    }
    const result = pile.length === ranks.indexOf(firstCard.rank);
    console.info("isLowerRank", result);

    return {
        status: result,
        statusText: result ? "" : MOVE_NOT_ALLOWED,
    };
};

export const isKingOnEmpty: CardRuleFn = (cards, pile) => {
    const topCard = _last(pile);
    const firstCard = _first(cards);
    if (!firstCard) {
        return genericError;
    }
    const result = !!topCard || (!topCard && firstCard.rank === Rank.King);
    console.info("isKingOnEmpty", result);

    return {
        status: result,
        statusText: result ? "" : MOVE_NOT_ALLOWED,
    };
};

export const hasNoStock = (stock: Card[], waste: Card[]): ValidationResult => ({
    status: stock.length === 0 && waste.length === 0,
    statusText: "There are still cards in the stock and/or waste piles",
});

export const isAllRevealed = (tableau: PileGroupType): ValidationResult => {
    const piles = tableau.flat();
    const result = piles.every((pile) =>
        pile.cards.every((card) => card.isRevealed),
    );
    console.info("isAllRevealed", result);

    return {
        status: result,
        statusText: "You need to reveal all cards on the tableau",
    };
};
