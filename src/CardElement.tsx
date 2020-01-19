import React, { useState } from 'react';
import classnames from 'classnames';
import _noop from 'lodash/noop';
import _reverse from 'lodash/reverse';
import { CardProps, CardTransferObject, PileName } from './definitions';

const CardElement = (props: CardProps): JSX.Element => {
    const {
        card,
        childCards = [],
        source,
        style,
        isTop = false,
        children,
        onClick = _noop,
        onDoubleClick = _noop
    } = props;

    const ref: React.RefObject<HTMLDivElement> = React.createRef();

    const [isDragging, setIsDragging] = useState(false);

    const [isHover, setIsHover] = useState(false);

    const [sourceName] = source;

    const handleMouseOver = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLDivElement>): void => {
        if (event && event.target === ref.current) {
            setIsHover(true);
        }
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FocusEvent<HTMLDivElement>): void => {
        if (event && event.target === ref.current) {
            setIsHover(false);
        }
    };

    const handleClick = (event: React.SyntheticEvent): void => {
        if (isTop) {
            onClick(event, card, source);
        }
    };

    const handleDoubleClick = (event: React.SyntheticEvent): void => {
        if (isTop) {
            onDoubleClick(event, card, source);
        }
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>): void => {
        if (event && event.target === ref.current && event.dataTransfer) {
            const grabbedCards = _reverse([...childCards, card]);
            const payload: CardTransferObject = {
                source: source,
                cards: grabbedCards
            };
            event.dataTransfer.setData('text/plain', JSON.stringify(payload));
            event.dataTransfer.effectAllowed = 'move'; // eslint-disable-line no-param-reassign
            setIsDragging(true);
        }
    };

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>): void => {
        setIsDragging(false);
    };

    return (
        <div
            className={classnames(
                'card',
                'card-' + card.color,
                isTop ? 'is-top' : null,
                isDragging ? 'is-dragging' : null,
                isHover ? 'is-hover' : null,
                card.isRevealed ? 'is-revealed is-draggable' : null,
                card.isRevealed || sourceName === PileName.STOCK ? 'is-clickable' : null
            )}
            ref={ref}
            data-rank={card.rank}
            data-suit={card.suit}
            data-color={card.color}
            data-symbol={card.symbol}
            style={style}
            draggable={card.isRevealed}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMouseOver={handleMouseOver}
            onFocus={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onMouseOut={handleMouseLeave}
            onBlur={handleMouseLeave}
        >
            <svg className="card-svg" viewBox="0 0 140 200">
                <use href="#svg-cards_svg__alternate-back" x="0" y="0" width="100%" height="100%" />
            </svg>
            {children}
        </div>
    );
};

export default CardElement;
