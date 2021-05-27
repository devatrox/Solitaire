import _last from "lodash/last";
import _first from "lodash/first";
import Card from "./Card";
import { ValidationResult } from "./definitions";
import { ranks } from "./setup";

const genericError = {
    status: false,
    statusText: "Some error occurred",
};

const MOVE_NOT_ALLOWED = "Move is not allowed";

const isDifferentColor = (cards: Card[], pile: Card[]): ValidationResult => {
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

const isHigherRank = (cards: Card[], pile: Card[]): ValidationResult => {
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

const isLowerRank = (cards: Card[], pile: Card[]): ValidationResult => {
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

const hasNoStock = (stock: Card[], waste: Card[]): ValidationResult => ({
    status: stock.length === 0 && waste.length === 0,
    statusText: "There are still cards in the stock and/or waste piles",
});

const isAllRevealed = (tableau: Card[][]): ValidationResult => {
    const cards = tableau.flat();
    const result = cards.every((card) => card.isRevealed);
    console.info("isAllRevealed", result);

    return {
        status: result,
        statusText: "You need to reveal all cards on the tableau",
    };
};

export {
    isAllRevealed,
    hasNoStock,
    isDifferentColor,
    isHigherRank,
    isLowerRank,
};
