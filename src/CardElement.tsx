import React, { useState } from 'react';
import classnames from 'classnames';
import _noop from 'lodash/noop';
import { CardProps, CardTransferObject, PileName } from './definitions';

const backCardSymbol = String.fromCodePoint(Number('0x0001F0A0'));

const CardElement = (props: CardProps) => {
    const {
        card,
        source,
        style,
        isTop = false,
        onClick = _noop,
        onDoubleClick = _noop
    } = props;

    const [isDragging, setIsDragging] = useState(false);

    const [sourceName, sourceIndex] = source;

    const handleClick = (event: React.SyntheticEvent) => {
        onClick(event, card);
    }

    const handleDoubleClick = (event: React.SyntheticEvent) => {
        onDoubleClick(event, card, source);
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (event && event.dataTransfer) {
            const payload: CardTransferObject = {
                source: source,
                card: card
            };
            event.dataTransfer.setData('text/plain', JSON.stringify(payload));
            event.dataTransfer.effectAllowed = 'move'; // eslint-disable-line no-param-reassign
        }

        setIsDragging(true);
    };

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(false);
    };

    return (
        <div
            className={classnames(
                'card',
                'card-' + card.color,
                isTop ? 'is-top' : null,
                isDragging ? 'is-dragging' : null,
                card.isRevealed ? 'is-revealed is-draggable' : null,
                card.isRevealed || sourceName === PileName.STOCK ? 'is-clickable' : null
            )}
            style={style}
            draggable={card.isRevealed}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="card-front">
                {card.symbol}
            </div>
            <div className="card-back">
                {backCardSymbol}
            </div>
        </div>
    )
}

export default CardElement;
