import React, { useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import _last from 'lodash/last';
import Pile from './Pile';
import PileGroup from './PileGroup';
import { PileName, AppProps, ActionTypes, Action } from './definitions';
import { getInitialState } from './setup';
import reducer from './reducer';
import 'normalize.css';
import './main.css'
import { Card } from './Card';

const App = (props: AppProps) => {
    const {
        initialState
    } = props;

    const [{ stock, waste, foundation, tableau }, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
    }, []);

    const handleStackClick = (event: React.SyntheticEvent, card: Card) => {
        console.log('handleStackClick', card)
        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                source: ['stock', 0, card],
                target: ['waste', 0]
            }
        });
        dispatch({
            type: ActionTypes.REVEAL_CARD,
            payload: {
                target: ['waste', 0, card]
            }
        });
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, target: [PileName, number]) => {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');

        try {
            const json = JSON.parse(data);
            console.log('handleDrop', json, target)

            const card = Card.fromJSON(json.card);
            const source = json.source;

            dispatch({
                type: ActionTypes.MOVE_CARDS,
                payload: {
                    source: [source[0], source[1], card],
                    target
                }
            });
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <div className="solitaire">
            <PileGroup name="stock" piles={stock} onClick={handleStackClick} />
            <PileGroup name="waste" piles={waste} />
            <PileGroup name="foundation" piles={foundation} onDrop={handleDrop} />
            <PileGroup name="tableau" piles={tableau} stackDown onDrop={handleDrop} />
        </div>
    )
}

ReactDOM.render(<App initialState={getInitialState()} />, document.getElementById('app'));
