import _cloneDeep from "lodash/cloneDeep";
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
} from "./definitions";
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
    prevState: GameState,
    mappedCards: MappedCard[],
    sourceName: ActionPayloadSourceName,
    targetName: ActionPayloadTargetName,
): GameState => {
    const newSource = _cloneDeep(prevState[sourceName]);
    const newTarget = _cloneDeep(prevState[targetName]);

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

    return {
        ...prevState,
        [sourceName]: newSource,
        [targetName]: newTarget,
    };
};

const finishAction = (prevState: GameState): GameState => {
    const piles = prevState.tableau
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

    return moveCardsAction(
        prevState,
        sortedCards,
        PileName.TABLEAU,
        PileName.FOUNDATION,
    );
};

const flipCardAction = (
    prevState: GameState,
    mappedCards: MappedCard[],
    targetName: ActionPayloadTargetName,
): GameState => {
    const newTarget = _cloneDeep(prevState[targetName]);

    for (const mappedCard of mappedCards) {
        const [targetCard, sourceIndex, targetIndex] = mappedCard;
        const cardToBeFlipped = newTarget[targetIndex].find(
            (card) => card.id === targetCard.id,
        );

        if (cardToBeFlipped) {
            cardToBeFlipped.flip();
        }
    }

    return {
        ...prevState,
        [targetName]: newTarget,
    };
};

const resetAction = (): GameState => createInitialState();

const reducer = (prevState: GameState, action: Action): GameState => {
    const { type, payload } = action;

    if (
        type === ActionTypes.MOVE_CARDS &&
        payload &&
        payload.cards &&
        payload.sourcePile &&
        payload.targetPile
    ) {
        return moveCardsAction(
            prevState,
            payload.cards,
            payload.sourcePile,
            payload.targetPile,
        );
    }

    if (type === ActionTypes.FINISH) {
        return finishAction(prevState);
    }

    if (
        type === ActionTypes.FLIP_CARD &&
        payload &&
        payload.cards &&
        payload.targetPile
    ) {
        return flipCardAction(prevState, payload.cards, payload.targetPile);
    }

    if (type === ActionTypes.RESET) {
        return resetAction();
    }

    return prevState;
};

export default reducer;
export { getFoundationTargetIndex };
