import React, { useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import _last from 'lodash/last';
import Pile from './Pile';
import PileGroup from './PileGroup';
import { PileName, AppProps, ActionTypes, CardTransferObject, Suit } from './definitions';
import { getInitialState, ranks } from './setup';
import reducer from './reducer';
import 'normalize.css';
import './main.css'
import Card from './Card';

const App = (props: AppProps) => {
    const {
        initialState
    } = props;

    const [{ stock, waste, foundation, tableau }, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        tableau.forEach((pile, i) => {
            const card = _last(pile);

            if (card && !card.revealed) {
                dispatch({
                    type: ActionTypes.REVEAL_CARD,
                    payload: {
                        target: [PileName.TABLEAU, i, card]
                    }
                });
            }
        });
    }, [tableau]);

    useEffect(() => {
        const card = _last(waste[0]);

        if (card && !card.revealed) {
            dispatch({
                type: ActionTypes.REVEAL_CARD,
                payload: {
                    target: [PileName.WASTE, 0, card]
                }
            });
        }
    }, [waste]);

    const handleStackClick = (event: React.SyntheticEvent, card: Card) => {
        console.log('handleStackClick', card)
        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                source: [PileName.STOCK, 0, card],
                target: [PileName.WASTE, 0]
            }
        });
    }

    const handleDoubleClick = (event: React.SyntheticEvent, card: Card, source: [PileName, number]) => {
        console.log('handleTableauDoubleClick', card)
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
                source: [sourceName, sourceIndex, card],
                target: [PileName.FOUNDATION, targetIndex]
            }
        });
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, target: [PileName, number]) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');

        try {
            const json: CardTransferObject = JSON.parse(data);
            console.log('handleDrop', json, target)

            const card = Card.fromJSON(json.card);
            const source = json.source;
            const [sourceName, sourceIndex] = source;

            dispatch({
                type: ActionTypes.MOVE_CARDS,
                payload: {
                    source: [sourceName, sourceIndex, card],
                    target
                }
            });
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <div className="solitaire">
            <PileGroup
                name={PileName.STOCK}
                piles={stock}
                onClick={handleStackClick}
            />
            <PileGroup
                name={PileName.WASTE}
                piles={waste}
                onDoubleClick={handleDoubleClick}
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
                onDoubleClick={handleDoubleClick}
            />
        </div>
    )
}

ReactDOM.render(<App initialState={getInitialState()} />, document.getElementById('app'));
