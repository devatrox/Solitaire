import React from 'react';
import CardElement from './Card';
import { PileProps } from './definitions';

const FoundationPile = (props: PileProps) => {
    const {
        cards,
        onDrop
    } = props;

    return (
        <div className="foundation-pile pile">
            {cards.map(card => (
                <CardElement
                    card={card}
                    onDrop={onDrop}
                    key={card.id}
                />
            ))}
        </div>
    )
}

export default FoundationPile;
