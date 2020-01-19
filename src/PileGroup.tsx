import React from 'react';
import Pile from './Pile';
import { GroupProps } from './definitions';

const PileGroup = (props: GroupProps): JSX.Element => {
    const {
        piles = [],
        name,
        stackDown,
        onDrop,
        onCardClick,
        onCardDoubleClick,
        onPileClick
    } = props;

    return (
        <div className={name}>
            {piles.map((pile, i) => (
                <Pile
                    name={name}
                    cards={pile}
                    index={i}
                    stackDown={stackDown}
                    onClick={onPileClick}
                    onDrop={onDrop}
                    onCardClick={onCardClick}
                    onCardDoubleClick={onCardDoubleClick}
                    key={i} // eslint-disable-line react/no-array-index-key
                />
            ))}
        </div>
    );
};

export default PileGroup;
