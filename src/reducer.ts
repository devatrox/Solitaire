import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _last from 'lodash/last';
import _cloneDeep from 'lodash/cloneDeep';
import {
    AppState, PileName, ActionTypes, Action
} from './definitions';
import { getInitialState, ranks } from './setup';

const reducer = (prevState: AppState, action: Action): AppState => {
    const { type, payload } = action;

    if (type === ActionTypes.MOVE_CARDS && payload.source && payload.target) {
        const [sourceName, sourceIndex, sourceCards] = payload.source;
        const [targetName, targetIndex] = payload.target;

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
    }

    if (type === ActionTypes.REVEAL_CARD && payload.target && payload.target[2]) {
        const [targetName, targetIndex, targetCard] = payload.target;

        const newTarget = _cloneDeep(prevState[targetName]);

        const cardToBeRevealed = _find(newTarget[targetIndex], (card) => card.id === targetCard.id);
        if (cardToBeRevealed) {
            cardToBeRevealed.isRevealed = true;
        }

        return {
            ...prevState,
            [targetName]: newTarget
        };
    }

    if (type === ActionTypes.RESET) {
        return {
            ...getInitialState()
        };
    }

    return prevState;
};

export default reducer;
