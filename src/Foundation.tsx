import React from 'react';
import FoundationPile from './FoundationPile';
import { GroupProps } from './definitions';

const Foundation = (props: GroupProps) => {
    const {
        piles = [],
        onDrop
    } = props;

    return (
        <div className="foundation">
            {piles.map((pile, i) => (
                <FoundationPile
                    cards={pile}
                    onDrop={onDrop}
                    key={i}
                />
            ))}
        </div>
    )
}

export default Foundation;
