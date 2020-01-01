import React from 'react';
import Pile from './Pile';
import { GroupProps } from './definitions';

const PileGroup = (props: GroupProps) => {
    const {
        piles = [],
        name,
        stackDown,
        onDrop,
        onClick,
        onDoubleClick
    } = props;

    return (
        <div className={name}>
            {piles.map((pile, i) => (
                <Pile
                    name={name}
                    cards={pile}
                    index={i}
                    stackDown={stackDown}
                    onDrop={onDrop}
                    onClick={onClick}
                    onDoubleClick={onDoubleClick}
                    key={i}
                />
            ))}
        </div>
    )
}

export default PileGroup;
