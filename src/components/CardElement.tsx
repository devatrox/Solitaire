import React, { useState, createRef, useMemo } from "react";
import styled from "styled-components";
import { useSpring, animated, config } from "@react-spring/web";
import _reverse from "lodash/reverse";
import { CardProps, CardTransferObject, PileName } from "../definitions";
import Card from "../Card";

const Svg = styled.svg.attrs({
    viewBox: "0 0 169.075 244.64",
})`
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
`;

const SvgFront = styled(Svg)``;

const SvgBack = styled(Svg)`
    fill: var(--color-blue);
    transform: rotateY(180deg);
`;

interface CardWrapperProps {
    $isAnimating: boolean;
    $isTop: boolean;
    $isHover: boolean;
    $card: Card;
}

const CardWrapper = styled(animated.div)<CardWrapperProps>`
    position: absolute;
    height: 100%;
    width: 100%;
    will-change: transform;
    transform-origin: center center;
    transform-style: preserve-3d;
    border-radius: var(--card-border-radius);
    box-shadow: ${(props) =>
        `0 0 ${
            props.$isAnimating && props.$isTop ? "10px" : "0"
        } rgba(0, 0, 0, 0.3)`};

    &:before,
    &:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        z-index: 2;
        box-shadow: inset 0 0 0 2px var(--card-border-color);
        border-radius: var(--card-border-radius);
    }

    &:after {
        transform: rotateY(180deg);
    }
`;

interface DragContainerProps {
    className?: string;
    $cursorStyle: "not-allowed" | "grab" | "pointer";
    $isDragging: boolean;
    $isBottom: boolean;
    $isStackDown: boolean;
    $isHover: boolean;
    $card: Card;
}

const DragContainer = styled(animated.div)<DragContainerProps>`
    cursor: ${(props) => props.$cursorStyle};
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: var(--card-border-radius);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
    perspective: 600px;
    will-change: transform, box-shadow;
    opacity: ${(props) => (props.$isDragging ? "0.5;" : "1;")}
        ${(props) =>
            !props.$isBottom &&
            props.$isStackDown &&
            `
        top: var(--card-stack-margin);
        z-index: 3;

        @media (max-width: 768px) {
            top: auto;
            left: var(--card-stack-margin);
        }
    `};
    ${(props) =>
        props.$isHover &&
        props.$card.isRevealed &&
        `
            --card-border-color: var(--color-orange);
        `}

    @media (max-width: 768px) {
        --card-border-color: transparent;
    }
`;

const CardElement: React.FC<CardProps> = ({
    card,
    childCards = [],
    source,
    style = {},
    isTop = false,
    isBottom = false,
    isStackDown = false,
    children,
    onClick,
    onDoubleClick,
}) => {
    const containerRref = createRef<HTMLDivElement>();
    const cardRref = createRef<HTMLDivElement>();

    const [isDragging, setIsDragging] = useState(false);

    const [isHover, setIsHover] = useState(false);

    const [isFlipping, setIsFlipping] = useState(false);

    const { transform: transformRotate } = useSpring({
        transform: `rotateX(${card.isRevealed ? 0 : 180}deg)`,
        config: config.stiff,
        onStart: () => setIsFlipping(true),
        onRest: () => setIsFlipping(false),
    });

    const { transform: transformScale, boxShadow } = useSpring({
        transform: `scale(${isHover && card.isRevealed ? "1.04" : "1"})`,
        boxShadow: `0 0 ${
            isHover && card.isRevealed ? "20" : "0"
        }px rgba(0, 0, 0, 0.3)`,
        config: config.stiff,
    });

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
        if (event?.target === cardRref.current) {
            setIsHover(true);
        }
    };

    const handleMouseLeave = (
        event:
            | React.MouseEvent<HTMLDivElement, MouseEvent>
            | React.FocusEvent<HTMLDivElement>,
    ) => {
        if (event?.target === cardRref.current) {
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
        if (event?.target === containerRref.current && event?.dataTransfer) {
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
        <DragContainer
            ref={containerRref}
            $card={card}
            $cursorStyle={cursorStyle}
            $isDragging={isDragging}
            $isBottom={isBottom}
            $isStackDown={isStackDown}
            $isHover={isHover}
            style={{
                ...style,
                boxShadow,
                transform: transformScale,
            }}
            draggable={card.isRevealed}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onMouseOut={handleMouseLeave}
            onFocus={handleMouseOver}
            onBlur={handleMouseLeave}
        >
            <CardWrapper
                ref={cardRref}
                $card={card}
                $isTop={isTop}
                $isHover={isHover}
                $isAnimating={isFlipping}
                style={{ transform: transformRotate }}
                data-rank={card.rank}
                data-suit={card.suit}
                data-color={card.color}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
            >
                <SvgFront>
                    <use href={`#${card.id}`} />
                </SvgFront>
                <SvgBack>
                    <use href="#alternate-back" />
                </SvgBack>
            </CardWrapper>
            {children}
        </DragContainer>
    );
};

export default CardElement;
