import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _last from 'lodash/last';
import _cloneDeep from 'lodash/cloneDeep';
import {
    AppState, PileName, ActionTypes, Action, ActionPayloadSource, ActionPayloadTarget
} from './definitions';
import { createInitialState, ranks } from './setup';

const moveCardsAction = (prevState: AppState, source: ActionPayloadSource, target: ActionPayloadTarget): AppState => {
    const [sourceName, sourceIndex, sourceCards] = source;
    const [targetName, targetIndex] = target;

    const newSource = _cloneDeep(prevState[sourceName]);

    const newTarget = _cloneDeep(prevState[targetName]);

    for (const sourceCard of sourceCards) {
        newSource[sourceIndex] = _filter(newSource[sourceIndex], (card) => card.id !== sourceCard.id);

        newTarget[targetIndex].push(sourceCard);
    }

    if (targetName === sourceName) {
        newTarget[sourceIndex] = newSource[sourceIndex];
    }

    if (targetName === PileName.FOUNDATION) {
        if (prevState[PileName.FOUNDATION][targetIndex].length !== ranks.indexOf(sourceCards[0].rank)) {
            console.info('Top most card must be of lower rank [A]');

            return prevState;
        }
    }

    if (targetName === PileName.TABLEAU && sourceCards.length > 0) {
        const topCard = _last(prevState[PileName.TABLEAU][targetIndex]);

        if (topCard) {
            if (topCard.color === sourceCards[0].color) {
                console.info('Top most card must be of a different color', topCard, sourceCards);

                return prevState;
            }

            if (ranks.indexOf(sourceCards[0].rank) !== ranks.indexOf(topCard.rank) - 1) {
                console.info('Top most card must be of higher rank');

                return prevState;
            }
        }
    }

    return {
        ...prevState,
        [sourceName]: newSource,
        [targetName]: newTarget
    };
};

const toggleCardAction = (prevState: AppState, target: ActionPayloadTarget): AppState => {
    const [targetName, targetIndex, targetCard] = target;

    if (targetCard) {
        const newTarget = _cloneDeep(prevState[targetName]);

        const cardToBeToggled = _find(newTarget[targetIndex], (card) => card.id === targetCard.id);
        if (cardToBeToggled) {
            cardToBeToggled.isRevealed = !cardToBeToggled.isRevealed;
        }

        return {
            ...prevState,
            [targetName]: newTarget
        };
    }

    return prevState;
};

const resetAction = (): AppState => createInitialState();

const reducer = (prevState: AppState, action: Action): AppState => {
    const { type, payload } = action;

    if (type === ActionTypes.MOVE_CARDS && payload.source && payload.target) {
        return moveCardsAction(prevState, payload.source, payload.target);
    }

    if (type === ActionTypes.TOGGLE_CARD && payload.target && payload.target[2]) {
        return toggleCardAction(prevState, payload.target);
    }

    if (type === ActionTypes.RESET) {
        return resetAction();
    }

    return prevState;
};

export default reducer;
