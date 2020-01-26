import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _last from 'lodash/last';
import _cloneDeep from 'lodash/cloneDeep';
import {
    Suit, AppState, PileName, ActionTypes, Action, ActionPayloadSource, ActionPayloadTarget, MappedCard
} from './definitions';
import Card from './Card';
import { createInitialState, ranks } from './setup';

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

const moveCardsAction = (prevState: AppState, mappedCards: MappedCard[], sourceName: ActionPayloadSource, targetName: ActionPayloadTarget): AppState => {
    const newSource = _cloneDeep(prevState[sourceName]);
    const newTarget = _cloneDeep(prevState[targetName]);

    for (const mappedCard of mappedCards) {
        const [sourceCard, sourceIndex, targetIndex] = mappedCard;

        newSource[sourceIndex] = _filter(newSource[sourceIndex], (card) => card.id !== sourceCard.id);

        newTarget[targetIndex].push(sourceCard);

        if (targetName === sourceName) {
            newTarget[sourceIndex] = newSource[sourceIndex];
        }

        if (targetName === PileName.FOUNDATION) {
            if (prevState[PileName.FOUNDATION][targetIndex].length !== ranks.indexOf(sourceCard.rank)) {
                console.info('Top most card must be of lower rank [A]');

                return prevState;
            }
        }

        if (targetName === PileName.TABLEAU) {
            const topCard = _last(prevState[PileName.TABLEAU][targetIndex]);

            if (topCard) {
                if (topCard.color === sourceCard.color) {
                    console.info('Top most card must be of a different color', topCard, sourceCard);

                    return prevState;
                }

                if (ranks.indexOf(sourceCard.rank) !== ranks.indexOf(topCard.rank) - 1) {
                    console.info('Top most card must be of higher rank');

                    return prevState;
                }
            }
        }
    }

    return {
        ...prevState,
        [sourceName]: newSource,
        [targetName]: newTarget
    };
};

const toggleCardAction = (prevState: AppState, mappedCards: MappedCard[], targetName: ActionPayloadTarget): AppState => {
    const newTarget = _cloneDeep(prevState[targetName]);

    for (const mappedCard of mappedCards) {
        const [targetCard, sourceIndex, targetIndex] = mappedCard;
        const cardToBeToggled = _find(newTarget[targetIndex], (card) => card.id === targetCard.id);

        if (cardToBeToggled) {
            cardToBeToggled.isRevealed = !cardToBeToggled.isRevealed;
        }
    }

    return {
        ...prevState,
        [targetName]: newTarget
    };
};

const resetAction = (): AppState => createInitialState();

const reducer = (prevState: AppState, action: Action): AppState => {
    const { type, payload } = action;

    if (type === ActionTypes.MOVE_CARDS && payload && payload.cards && payload.sourcePile && payload.targetPile) {
        return moveCardsAction(prevState, payload.cards, payload.sourcePile, payload.targetPile);
    }

    if (type === ActionTypes.TOGGLE_CARD && payload && payload.cards && payload.targetPile) {
        return toggleCardAction(prevState, payload.cards, payload.targetPile);
    }

    if (type === ActionTypes.RESET) {
        return resetAction();
    }

    return prevState;
};

export default reducer;
export {
    getFoundationTargetIndex
};
