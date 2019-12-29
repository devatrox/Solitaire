import React, { useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import _last from 'lodash/last';
import StockPile from './StockPile';
import WastePile from './WastePile';
import Foundation from './Foundation';
import Tableau from './Tableau';
import { ActionTypes, Action } from './definitions';
import { initialState } from './setup';
import reducer from './reducer';
import 'normalize.css';
import './main.css'
import { Card } from './Card';

const App = () => {
    const [{ stock, waste, foundation, tableau }, dispatch] = useReducer(reducer, initialState());

    useEffect(() => {
    }, []);

    const handleStackClick = (event: React.SyntheticEvent, card: Card) => {
        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                source: ['stock', 0, card],
                target: ['waste', 0]
            }
        });
        dispatch({
            type: ActionTypes.FLIP_CARD,
            payload: {
                target: ['waste', 0, card]
            }
        });
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, card: Card) => {
        event.preventDefault();
        console.log('handleDrop', event.dataTransfer.getData('text/plain'))
        // const source = Card.fromString(
        //     event.dataTransfer.getData('text/plain')
        // );

        // dispatch({
        //     type: ActionTypes.MOVE_CARDS,
        //     payload: {
        //         source: ['stock', 0, card],
        //         target: ['waste', 0]
        //     }
        // });
    };

    return (
        <div className="solitaire">
            <StockPile cards={stock[0]} onClick={handleStackClick} />
            <WastePile cards={waste[0]} />
            <Foundation piles={foundation} onDrop={handleDrop} />
            <Tableau piles={tableau} onDrop={handleDrop} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('app'));
