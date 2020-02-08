/** @jsx jsx */

import React, { useState } from 'react';
import { jsx, css } from '@emotion/core';
import _noop from 'lodash/noop';
import _reverse from 'lodash/reverse';
import { CardProps, CardTransferObject, PileName } from '../definitions';

const CardElement = (props: CardProps): JSX.Element => {
    const {
        card,
        childCards = [],
        source,
        style,
        isTop = false,
        isBottom = false,
        isStackDown = false,
        children,
        onClick = _noop,
        onDoubleClick = _noop
    } = props;

    const ref: React.RefObject<HTMLDivElement> = React.createRef();

    const [isDragging, setIsDragging] = useState(false);

    const [isHover, setIsHover] = useState(false);

    const [sourceName] = source;

    let cursorStyle = 'pointer';

    if (!card.isRevealed && sourceName !== PileName.STOCK) {
        cursorStyle = 'not-allowed';
    } else if (card.isRevealed) {
        cursorStyle = 'grab';
    }

    const styles = css`
        label: Card;
        cursor: ${cursorStyle};
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        transform: scale(1);
        transition: transform 50ms ease-in-out;
        ${isHover && card.isRevealed && `
            transform: scale(1.04);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        `}
        ${isDragging && `
            opacity: 0.5;
        `}
        ${!isBottom && isStackDown && `
            top: var(--card-stack-margin);
            z-index: 2;
        `}
    `;

    const svgStyles = css`
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        border-radius: var(--card-border-radius);
        backface-visibility: hidden;
        transition: transform 300ms ease-in-out;
    `;

    const svgFrontStyles = css`
        label: CardSvgFront;
        ${svgStyles}
        ${card.isRevealed && `
            transform: perspective(800px) rotateX(0deg);
        `}
        ${!card.isRevealed && `
            transform: perspective(800px) rotateX(180deg);
        `}
    `;

    const svgBackStyles = css`
        label: CardSvgBack;
        ${svgStyles}
        fill: var(--color-blue);
        ${card.isRevealed && `
            transform: perspective(800px) rotateX(180deg);
        `}
        ${!card.isRevealed && `
            transform: perspective(800px) rotateX(0deg);
        `}
    `;

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
            css={styles}
            ref={ref}
            data-rank={card.rank}
            data-suit={card.suit}
            data-color={card.color}
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
            <svg css={svgFrontStyles} viewBox="0 0 169.075 244.64">
                <use href={`#svg-cards_svg__${card.id}`} />
            </svg>
            <svg css={svgBackStyles} viewBox="0 0 169.075 244.64">
                <use href="#svg-cards_svg__alternate-back" />
            </svg>
            {children}
        </div>
    );
};

export default CardElement;