import React from 'react';
import TableauPile from './TableauPile';
import { GroupProps } from './definitions';

const Tableau = (props: GroupProps) => {
    const {
        piles = [],
        onDrop
    } = props;

    return (
        <div className="tableau">
            {piles.map((pile, i) => (
                <TableauPile
                    cards={pile}
                    onDrop={onDrop}
                    key={i}
                />
            ))}
        </div>
    )
}

export default Tableau;
