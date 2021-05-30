import React, { useState, createRef, useMemo } from "react";
import styled from "styled-components";
import _reverse from "lodash/reverse";
import { CardProps, CardTransferObject, PileName } from "../definitions";
import Card from "../Card";

interface SvgInterface {
    card: Card;
}

const Svg = styled.svg<SvgInterface>`
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

const SvgFront = styled(Svg)`
    transform: ${(props) =>
        props.card.isRevealed
            ? "perspective(800px) rotateX(0deg)"
            : "perspective(800px) rotateX(180deg)"};
`;

const SvgBack = styled(Svg)`
    fill: var(--color-blue);
    transform: ${(props) =>
        props.card.isRevealed
            ? "perspective(800px) rotateX(180deg)"
            : "perspective(800px) rotateX(0deg)"};
`;

interface StyledContainerProps {
    cursorStyle: "not-allowed" | "grab" | "pointer";
    isHover: boolean;
    isDragging: boolean;
    isBottom: boolean;
    isStackDown: boolean;
    card: Card;
}

const StyledContainer = styled.div<StyledContainerProps>`
    cursor: ${(props) => props.cursorStyle};
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: var(--card-border-radius);
    transform: scale(1);
    transition: transform 50ms ease-in-out;

    @media (max-width: 768px) {
        --card-border-color: transparent;
    }

    ${(props) =>
        props.isHover &&
        props.card.isRevealed &&
        `
        --card-border-color: var(--color-orange);
        transform: scale(1.04);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);

        @media (max-width: 768px) {
            --card-border-color: var(--color-orange);
        }
    `}
    ${(props) =>
        props.isDragging &&
        `
        opacity: 0.5;
    `}
    ${(props) =>
        !props.isBottom &&
        props.isStackDown &&
        `
        top: var(--card-stack-margin);
        z-index: 3;

        @media (max-width: 768px) {
            top: auto;
            left: var(--card-stack-margin);
        }
    `}

    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        z-index: 2;
        box-shadow: inset 0 0 0 3px var(--card-border-color);
        border-radius: var(--card-border-radius);

        @media (max-width: 768px) {
            box-shadow: inset 0 0 0 2px var(--card-border-color);
        }
    }
`;

const CardElement: React.FC<CardProps> = ({
    card,
    childCards = [],
    source,
    style,
    isTop = false,
    isBottom = false,
    isStackDown = false,
    children,
    onClick,
    onDoubleClick,
}) => {
    const ref = createRef<HTMLDivElement>();

    const [isDragging, setIsDragging] = useState(false);

    const [isHover, setIsHover] = useState(false);

    const [sourceName] = source;

    const cursorStyle = useMemo(() => {
        if (!card.isRevealed && sourceName !== PileName.STOCK) {
            return "not-allowed";
        } else if (card.isRevealed) {
            return "grab";
        }
        return "pointer";
    }, [card.isRevealed, sourceName]);

    const handleMouseOver = (
        event:
            | React.MouseEvent<HTMLDivElement, MouseEvent>
            | React.FocusEvent<HTMLDivElement>,
    ) => {
        if (event?.target === ref.current) {
            setIsHover(true);
        }
    };

    const handleMouseLeave = (
        event:
            | React.MouseEvent<HTMLDivElement, MouseEvent>
            | React.FocusEvent<HTMLDivElement>,
    ) => {
        if (event?.target === ref.current) {
            setIsHover(false);
        }
    };

    const handleClick = (event: React.SyntheticEvent) => {
        if (isTop) {
            onClick?.(event, card, source);
        }
    };

    const handleDoubleClick = (event: React.SyntheticEvent) => {
        if (isTop) {
            onDoubleClick?.(event, card, source);
        }
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (event?.target === ref.current && event?.dataTransfer) {
            const grabbedCards = _reverse([...childCards, card]);
            const payload: CardTransferObject = {
                source: source,
                cards: grabbedCards,
            };
            event.dataTransfer.setData("text/plain", JSON.stringify(payload));
            event.dataTransfer.effectAllowed = "move"; // eslint-disable-line no-param-reassign
            setIsDragging(true);
        }
    };

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(false);
    };

    return (
        <StyledContainer
            ref={ref}
            cursorStyle={cursorStyle}
            isHover={isHover}
            isDragging={isDragging}
            isBottom={isBottom}
            isStackDown={isStackDown}
            card={card}
            style={style}
            data-rank={card.rank}
            data-suit={card.suit}
            data-color={card.color}
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
            <SvgFront card={card} viewBox="0 0 169.075 244.64">
                <use href={`#${card.id}`} />
            </SvgFront>
            <SvgBack card={card} viewBox="0 0 169.075 244.64">
                <use href="#alternate-back" />
            </SvgBack>
            {children}
        </StyledContainer>
    );
};

export default CardElement;
