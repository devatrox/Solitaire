import React from 'react';
import CardElement from './Card';
import { PileProps } from './definitions';

const TableauPile = (props: PileProps) => {
    const {
        cards,
        onDrop
    } = props;

    return (
        <div className="tableau-pile pile">
            {cards.map((card, i) => (
                <CardElement
                    card={card}
                    style={{ marginTop: i * 20 + 'px' }}
                    onDrop={onDrop}
                    key={card.id}
                />
            ))}
        </div>
    )
}

export default TableauPile;
