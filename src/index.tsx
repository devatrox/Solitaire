import React, { useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import _last from 'lodash/last';
import _reverse from 'lodash/reverse';
import PileGroup from './PileGroup';
import {
    PileName, AppProps, ActionTypes, CardTransferObject, Suit
} from './definitions';
import { createInitialState } from './setup';
import reducer from './reducer';
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

    useEffect(() => {
        tableau.forEach((pile, i) => {
            const card = _last(pile);

            if (card && !card.isRevealed) {
                dispatch({
                    type: ActionTypes.TOGGLE_CARD,
                    payload: {
                        target: [PileName.TABLEAU, i, card]
                    }
                });
            }
        });
    }, [tableau]);

    useEffect(() => {
        const card = _last(waste[0]);

        if (card && !card.isRevealed) {
            dispatch({
                type: ActionTypes.TOGGLE_CARD,
                payload: {
                    target: [PileName.WASTE, 0, card]
                }
            });
        }
    }, [waste]);

    useEffect(() => {
        const pile = stock[0];

        for (const card of pile) {
            if (card.isRevealed) {
                dispatch({
                    type: ActionTypes.TOGGLE_CARD,
                    payload: {
                        target: [PileName.STOCK, 0, card]
                    }
                });
            }
        }
    }, [stock]);

    const handleStockClick = (event: React.SyntheticEvent): void => {
        const reversedWasteCards = _reverse(waste[0]);

        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                source: [PileName.WASTE, 0, reversedWasteCards],
                target: [PileName.STOCK, 0]
            }
        });
    };

    const handleStockCardClick = (event: React.SyntheticEvent, card: Card): void => {
        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                source: [PileName.STOCK, 0, [card]],
                target: [PileName.WASTE, 0]
            }
        });
    };

    const handleCardDoubleClick = (event: React.SyntheticEvent, card: Card, source: [PileName, number]): void => {
        const [sourceName, sourceIndex] = source;
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

        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                source: [sourceName, sourceIndex, [card]],
                target: [PileName.FOUNDATION, targetIndex]
            }
        });
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, target: [PileName, number]): void => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');

        try {
            const json: CardTransferObject = JSON.parse(data);

            const cards = json.cards.map((card) => Card.fromJSON(card));
            const [sourceName, sourceIndex] = json.source;

            dispatch({
                type: ActionTypes.MOVE_CARDS,
                payload: {
                    source: [sourceName, sourceIndex, cards],
                    target
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
                <button type="button" onClick={handleReset}>Reset</button>
            </div>
        </div>
    );
};

ReactDOM.render(<App initialState={createInitialState()} />, document.getElementById('app'));
