import React from 'react';
import CardElement from './Card';
import { PileProps } from './definitions';

const StockPile = (props: PileProps) => {
    const {
        cards,
        onClick
    } = props;

    return (
        <div className="stock pile">
            {cards.map(card => (
                <CardElement
                    card={card}
                    onClick={onClick}
                    key={card.id}
                />
            ))}
        </div>
    )
}

export default StockPile;
