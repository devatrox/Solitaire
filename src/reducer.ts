import _filter from 'lodash/filter';
import _find from 'lodash/find';
import _last from 'lodash/last';
import _cloneDeep from 'lodash/cloneDeep';
import _flatten from 'lodash/flatten';
import _sortBy from 'lodash/sortBy';
import _every from 'lodash/every';
import {
    Suit, AppState, PileName, ActionTypes, Action, ActionPayloadSourceName, ActionPayloadTargetName, MappedCard
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

const moveCardsAction = (prevState: AppState, mappedCards: MappedCard[], sourceName: ActionPayloadSourceName, targetName: ActionPayloadTargetName): AppState => {
    const newSource = _cloneDeep(prevState[sourceName]);
    const newTarget = _cloneDeep(prevState[targetName]);

    for (const mappedCard of mappedCards) {
        const [sourceCard, sourceIndex, targetIndex] = mappedCard;

        if (targetName === PileName.FOUNDATION) {
            if (newTarget[targetIndex].length !== ranks.indexOf(sourceCard.rank)) {
                console.info('Top most card must be of lower rank');

                return prevState;
            }
        }

        if (targetName === PileName.TABLEAU) {
            const topCard = _last(newTarget[targetIndex]);

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

        newSource[sourceIndex] = _filter(newSource[sourceIndex], (card) => card.id !== sourceCard.id);

        newTarget[targetIndex].push(sourceCard);

        if (targetName === sourceName) {
            newTarget[sourceIndex] = newSource[sourceIndex];
        }
    }

    return {
        ...prevState,
        [sourceName]: newSource,
        [targetName]: newTarget
    };
};

const finishAction = (prevState: AppState): AppState => {
    if (prevState.stock[0].length === 0 && prevState.waste[0].length === 0) {
        const piles = _flatten(prevState.tableau.map((pile, pileIndex) => pile.map((card): MappedCard => {
            const targetIndex = getFoundationTargetIndex(card);
            return [card, pileIndex, targetIndex];
        })));
        const sortedCards = _sortBy(piles, (mappedCard) => {
            const [card] = mappedCard;

            return card.rank;
        });

        if (_every(sortedCards, (mappedCard) => mappedCard[0].isRevealed)) {
            return moveCardsAction(prevState, sortedCards, PileName.TABLEAU, PileName.FOUNDATION);
        }

        console.info('You need to reveal all cards on the tableau');
        return prevState;
    }

    console.info('There are still cards in the stock and/or waste piles');
    return prevState;
};

const flipCardAction = (prevState: AppState, mappedCards: MappedCard[], targetName: ActionPayloadTargetName): AppState => {
    const newTarget = _cloneDeep(prevState[targetName]);

    for (const mappedCard of mappedCards) {
        const [targetCard, sourceIndex, targetIndex] = mappedCard;
        const cardToBeFlipped = _find(newTarget[targetIndex], (card) => card.id === targetCard.id);

        if (cardToBeFlipped) {
            cardToBeFlipped.flip();
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

    if (type === ActionTypes.FINISH) {
        return finishAction(prevState);
    }

    if (type === ActionTypes.FLIP_CARD && payload && payload.cards && payload.targetPile) {
        return flipCardAction(prevState, payload.cards, payload.targetPile);
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
