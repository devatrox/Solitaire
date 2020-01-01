import _filter from 'lodash/filter';
import _shuffle from 'lodash/shuffle';
import _isArray from 'lodash/isArray';
import _find from 'lodash/find';
import _last from 'lodash/last';
import _cloneDeep from 'lodash/cloneDeep';
import { AppState, PileName, ActionTypes, Action } from './definitions';
import { getInitialState, ranks } from './setup';

const reducer = (prevState: AppState, action: Action) => {
    const { type, payload } = action;

    if (type === ActionTypes.MOVE_CARDS && payload.source && payload.target) {
        const [sourceName, sourceIndex, sourceCards] = payload.source;
        const [targetName, targetIndex] = payload.target;
        console.log('MOVE_CARDS', sourceName, targetName, sourceCards)

        const newSource = _cloneDeep(prevState[sourceName]);

        const newTarget = _cloneDeep(prevState[targetName]);

        if (_isArray(sourceCards)) {
            for (let sourceCard of sourceCards) {
                newSource[sourceIndex] = _filter(newSource[sourceIndex], card => card.id !== sourceCard.id);

                newTarget[targetIndex].push(sourceCard);
            }
        } else {
            newSource[sourceIndex] = _filter(newSource[sourceIndex], card => card.id !== sourceCards.id);

            newTarget[targetIndex].push(sourceCards);
        }

        if (targetName === sourceName) {
            newTarget[sourceIndex] = newSource[sourceIndex];
        }

        if (targetName === PileName.FOUNDATION) {
            if (_isArray(sourceCards)) {
                if (prevState[PileName.FOUNDATION][targetIndex].length !== ranks.indexOf(sourceCards[0].rank)) {
                    console.info('Top most card must be of lower rank [A]');

                    return prevState;
                }
            } else {
                if (prevState[PileName.FOUNDATION][targetIndex].length !== ranks.indexOf(sourceCards.rank)) {
                    console.info('Top most card must be of lower rank');

                    return prevState;
                }
            }
        }

        if (targetName === PileName.TABLEAU && !_isArray(sourceCards)) {
            const topCard = _last(prevState[PileName.TABLEAU][targetIndex]);
            console.log(prevState)

            if (topCard) {
                if (topCard.color === sourceCards.color) {
                    console.info('Top most card must be of a different color', topCard, sourceCards);

                    return prevState;
                }

                if (ranks.indexOf(sourceCards.rank) !== ranks.indexOf(topCard.rank) - 1) {
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
        console.log('REVEAL_CARD', targetName, targetCard)

        const newTarget = _cloneDeep(prevState[targetName]);

        const card = _find(newTarget[targetIndex], (card) => card.id === targetCard.id);
        if (card) {
            card.revealed = true;
        }

        return {
            ...prevState,
            [targetName]: newTarget
        };
    }

    if (type === ActionTypes.RESET) {
        return {
            ...getInitialState()
        }
    }

    return prevState;
};

export default reducer;
