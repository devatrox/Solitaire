import React from 'react';
import _clone from 'lodash/clone';
import _filter from 'lodash/filter';
import _shuffle from 'lodash/shuffle';
import _isArray from 'lodash/isArray';
import _find from 'lodash/find';
import { Card } from './Card';
import { AppState, Pile, ActionTypes, ActionPayload, Action } from './definitions';
import { initialState } from './setup';

const reducer = (prevState: AppState, action: Action) => {
    const { type, payload } = action;

    if (type === ActionTypes.MOVE_CARDS && payload.source && payload.target) {
        console.log('MOVE_CARDS')
        const [sourceName, sourceIndex, sourceCards] = payload.source;
        const [targetName, targetIndex] = payload.target;

        const newSource = [
            ...prevState[sourceName]
        ];

        const newTarget = [
            ...prevState[targetName]
        ];

        if (_isArray(sourceCards)) {
            for (let sourceCard of sourceCards) {
                newSource[sourceIndex] = _filter(newSource[sourceIndex], card => card.id !== sourceCard.id);

                newTarget[targetIndex].push(sourceCard);
            }
        } else {
            newSource[sourceIndex] = _filter(newSource[sourceIndex], card => card.id !== sourceCards.id);

            newTarget[targetIndex].push(sourceCards);
        }

        return {
            ...prevState,
            [sourceName]: newSource,
            [targetName]: newTarget
        };
    }

    if (type === ActionTypes.FLIP_CARD && payload.target && payload.target[2]) {
        console.log('FLIP_CARD')
        const [targetName, targetIndex, targetCard] = payload.target;

        const newTarget = [
            ...prevState[targetName]
        ];

        const card = _find(newTarget[targetIndex], (card: Card) => card.id === targetCard.id);
        if (card) {
            card.flipped = false;
        }

        return {
            ...prevState,
            [targetName]: newTarget
        };
    }

    if (type === ActionTypes.RESET) {
        return {
            ...initialState()
        }
    }

    throw new Error();
};

export default reducer;
