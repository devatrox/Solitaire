import React from 'react';
import CardElement from './Card';
import { PileProps } from './definitions';

const WastePile = (props: PileProps) => {
    const {
        cards
    } = props;

    return (
        <div className="waste pile">
            {cards.map(card => (
                <CardElement
                    card={card}
                    key={card.id}
                />
            ))}
        </div>
    )
}

export default WastePile;
