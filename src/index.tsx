import React, { useReducer, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import _last from 'lodash/last';
import _reverse from 'lodash/reverse';
import _flattenDeep from 'lodash/flattenDeep';
import _every from 'lodash/every';
import PileGroup from './PileGroup';
import {
    PileName, AppProps, ActionTypes, CardTransferObject, MappedCard
} from './definitions';
import { createInitialState, cardCount } from './setup';
import reducer, { getFoundationTargetIndex } from './reducer';
import 'normalize.css';
import './main.scss';
import Card from './Card';

const App = (props: AppProps): JSX.Element => {
    const {
        initialState
    } = props;

    const [{
        stock, waste, foundation, tableau
    }, dispatch] = useReducer(reducer, initialState);

    const isDone = useMemo((): boolean => {
        const allCards = _flattenDeep([...stock, ...waste, ...foundation]);
        const isAllRevealed = _every(allCards, (card) => card.isRevealed);
        const isStockAndWasteEmpty = stock[0].length === 0 && waste[0].length === 0;
        return isStockAndWasteEmpty && isAllRevealed;
    }, [foundation, stock, waste]);

    const isFinished = useMemo((): boolean => {
        const allTableauCards = _flattenDeep(foundation);
        return allTableauCards.length === cardCount;
    }, [foundation]);

    useEffect(() => {
        if (isFinished) {
            console.info('Congratulations!');
        }
    }, [isFinished, foundation]);

    useEffect(() => {
        tableau.forEach((pile, i) => {
            const topCard = _last(pile);

            if (topCard && !topCard.isRevealed) {
                dispatch({
                    type: ActionTypes.FLIP_CARD,
                    payload: {
                        cards: [[topCard, i, i]],
                        targetPile: PileName.TABLEAU
                    }
                });
            }
        });
    }, [tableau]);

    useEffect(() => {
        const topCard = _last(waste[0]);

        if (topCard && !topCard.isRevealed) {
            dispatch({
                type: ActionTypes.FLIP_CARD,
                payload: {
                    cards: [[topCard, 0, 0]],
                    targetPile: PileName.WASTE
                }
            });
        }
    }, [waste]);

    useEffect(() => {
        const pile = stock[0];

        for (const card of pile) {
            if (card.isRevealed) {
                dispatch({
                    type: ActionTypes.FLIP_CARD,
                    payload: {
                        cards: [[card, 0, 0]],
                        targetPile: PileName.STOCK
                    }
                });
            }
        }
    }, [stock]);

    const handleStockClick = (event: React.SyntheticEvent): void => {
        const mappedCards = waste[0].map((card): MappedCard => [card, 0, 0]);
        const reversedWasteCards = _reverse(mappedCards);

        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                cards: reversedWasteCards,
                sourcePile: PileName.WASTE,
                targetPile: PileName.STOCK
            }
        });
    };

    const handleStockCardClick = (event: React.SyntheticEvent, card: Card): void => {
        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                cards: [[card, 0, 0]],
                sourcePile: PileName.STOCK,
                targetPile: PileName.WASTE
            }
        });
    };

    const handleCardDoubleClick = (event: React.SyntheticEvent, card: Card, source: [PileName, number]): void => {
        const [sourceName, sourceIndex] = source;
        const targetIndex = getFoundationTargetIndex(card);

        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                cards: [[card, sourceIndex, targetIndex]],
                sourcePile: sourceName,
                targetPile: PileName.FOUNDATION
            }
        });
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, target: [PileName, number]): void => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const [targetName, targetIndex] = target;

        try {
            const json: CardTransferObject = JSON.parse(data);
            const [sourceName, sourceIndex] = json.source;

            const cards: MappedCard[] = json.cards.map((cardJson) => {
                const card = Card.fromJSON(cardJson);
                return [card, sourceIndex, targetIndex];
            });

            dispatch({
                type: ActionTypes.MOVE_CARDS,
                payload: {
                    cards: cards,
                    sourcePile: sourceName,
                    targetPile: targetName
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleReset = (event: React.SyntheticEvent): void => {
        dispatch({
            type: ActionTypes.RESET
        });
    };

    const handleFinish = (event: React.SyntheticEvent): void => {
        dispatch({
            type: ActionTypes.FINISH
        });
    };

    return (
        <div className="solitaire">
            <PileGroup
                name={PileName.STOCK}
                piles={stock}
                onPileClick={handleStockClick}
                onCardClick={handleStockCardClick}
            />
            <PileGroup
                name={PileName.WASTE}
                piles={waste}
                onCardDoubleClick={handleCardDoubleClick}
            />
            <PileGroup
                name={PileName.FOUNDATION}
                piles={foundation}
                onDrop={handleDrop}
            />
            <PileGroup
                name={PileName.TABLEAU}
                piles={tableau}
                stackDown
                onDrop={handleDrop}
                onCardDoubleClick={handleCardDoubleClick}
            />
            <div className="menu">
                <button type="button" onClick={handleReset}>New Game</button>
                <button type="button" disabled={!isDone} onClick={handleFinish}>Finish</button>
            </div>
        </div>
    );
};

ReactDOM.render(<App initialState={createInitialState()} />, document.getElementById('app'));
