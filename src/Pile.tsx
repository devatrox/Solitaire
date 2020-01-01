import React, { useState } from 'react';
import classnames from 'classnames';
import _noop from 'lodash/noop';
import CardElement from './CardElement';
import { PileProps, PileName } from './definitions';

const Pile = (props: PileProps) => {
    const {
        cards,
        name,
        index = 0,
        stackDown = false,
        onDrop = _noop,
        onClick,
        onDoubleClick
    } = props;

    const [isHover, setIsHover] = useState(false);

    let enterTarget: EventTarget | null = null;

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        onDrop(event, [name, index]);
    }

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        enterTarget = event.target;
        setIsHover(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        if (enterTarget === event.target) {
            event.stopPropagation();
            event.preventDefault();
            setIsHover(false);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        if ([...event.dataTransfer.types].includes('text/plain')) {
            // This is necessary so the element works as a drop target
            event.preventDefault();
            event.stopPropagation();
        }
    };

    return (
        <div
            className={classnames(
                `${name}-pile`,
                'pile',
                isHover ? 'is-hover' : null,
            )}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
        >
            {cards.map((card, i) => (
                <CardElement
                    card={card}
                    source={[name, index]}
                    style={stackDown ? { marginTop: i * 20 + 'px' } : undefined}
                    key={card.id}
                    onClick={onClick}
                    onDoubleClick={onDoubleClick}
                />
            ))}
        </div>
    )
}

export default Pile;
