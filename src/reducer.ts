import _sortBy from "lodash/sortBy";
import {
    Suit,
    GameState,
    PileName,
    ActionTypes,
    Action,
    ActionPayloadSourceName,
    ActionPayloadTargetName,
    MappedCard,
} from "./types";
import Card from "./Card";
import { createInitialState } from "./setup";

const getFoundationTargetIndex = (card: Card): number => {
    let targetIndex = 0;

    if (card.suit === Suit.Heart) {
        targetIndex = 1;
    }

    if (card.suit === Suit.Diamond) {
        targetIndex = 2;
    }

    if (card.suit === Suit.Club) {
        targetIndex = 3;
    }

    return targetIndex;
};

const moveCardsAction = (
    draft: GameState,
    mappedCards: MappedCard[],
    sourceName: ActionPayloadSourceName,
    targetName: ActionPayloadTargetName,
) => {
    const newSource = draft[sourceName];
    const newTarget = draft[targetName];

    for (const mappedCard of mappedCards) {
        const [sourceCard, sourceIndex, targetIndex] = mappedCard;

        newSource[sourceIndex] = newSource[sourceIndex].filter(
            (card) => card.id !== sourceCard.id,
        );

        newTarget[targetIndex].push(sourceCard);

        if (targetName === sourceName) {
            newTarget[sourceIndex] = newSource[sourceIndex];
        }
    }
};

const finishAction = (draft: GameState) => {
    const piles = draft.tableau
        .map((pile, pileIndex) =>
            pile.map((card): MappedCard => {
                const targetIndex = getFoundationTargetIndex(card);
                return [card, pileIndex, targetIndex];
            }),
        )
        .flat();
    const sortedCards = _sortBy(piles, (mappedCard) => {
        const [card] = mappedCard;

        return card.rank;
    });

    moveCardsAction(draft, sortedCards, PileName.TABLEAU, PileName.FOUNDATION);
};

const flipCardAction = (
    draft: GameState,
    mappedCards: MappedCard[],
    targetName: ActionPayloadTargetName,
) => {
    const newTarget = draft[targetName];

    for (const mappedCard of mappedCards) {
        const [targetCard, , targetIndex] = mappedCard;
        const cardToBeFlipped = newTarget[targetIndex].find(
            (card) => card.id === targetCard.id,
        );

        if (cardToBeFlipped) {
            cardToBeFlipped.flip();
        }
    }
};

const resetAction = (draft: GameState) => {
    const newState = createInitialState();
    draft.stock = newState.stock;
    draft.waste = newState.waste;
    draft.foundation = newState.foundation;
    draft.tableau = newState.tableau;
};

const reducer = (draft: GameState, { type, payload }: Action) => {
    switch (type) {
        case ActionTypes.MOVE_CARDS:
            if (
                payload &&
                payload.cards &&
                payload.sourcePile &&
                payload.targetPile
            ) {
                moveCardsAction(
                    draft,
                    payload.cards,
                    payload.sourcePile,
                    payload.targetPile,
                );
            }
            break;
        case ActionTypes.FINISH:
            finishAction(draft);
            break;
        case ActionTypes.FLIP_CARD:
            if (payload && payload.cards && payload.targetPile) {
                flipCardAction(draft, payload.cards, payload.targetPile);
            }
            break;
        case ActionTypes.RESET:
            resetAction(draft);
            break;
        default:
            break;
    }
};

export default reducer;
export { getFoundationTargetIndex };
