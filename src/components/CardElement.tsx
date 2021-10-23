import React, { useState, createRef, useMemo, useEffect } from "react";
import { Box, BoxProps } from "@theme-ui/components";
import { SxProp } from "@theme-ui/core";
import { useSpring, animated, config } from "@react-spring/web";
import _reverse from "lodash/reverse";

import {
    CardClickEvent,
    CardTransferObject,
    DropEvent,
    PileName,
} from "../definitions";
import Card from "../Card";
import { CARD_BORDER_RADIUS, CARD_STACK_MARGIN } from "../theme";

const Svg: React.FC<React.SVGProps<SVGSVGElement> & SxProp> = ({
    sx,
    ...svgProps
}) => (
    <svg
        viewBox="0 0 169.075 244.64"
        sx={{
            zIndex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            pointerEvents: "none",
            borderRadius: CARD_BORDER_RADIUS,
            backfaceVisibility: "hidden",
            ...sx,
        }}
        {...svgProps}
    />
);

export interface CardProps
    extends Omit<BoxProps, "onClick" | "onDoubleClick" | "onDrop"> {
    card: Card;
    source: [PileName, number];
    isTop?: boolean;
    isBottom?: boolean;
    isStackDown?: boolean;
    childCards?: Card[];
    onClick?: CardClickEvent;
    onDoubleClick?: CardClickEvent;
    onDrop?: DropEvent;
}

const AnimatedBox = animated(Box);

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
    const containerRef = createRef<HTMLDivElement>();
    const cardRef = createRef<HTMLDivElement>();

    const [isDragging, setIsDragging] = useState(false);

    const [isHover, setIsHover] = useState(false);

    const [isFlipping, setIsFlipping] = useState(false);

    const [borderColor, setBorderColor] = useState("black");

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

    const handleMouseOver: React.MouseEventHandler<HTMLDivElement> = (
        event,
    ) => {
        if (event?.target === cardRef.current) {
            setIsHover(true);
        }
    };

    const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = (
        event,
    ) => {
        if (event?.target === cardRef.current) {
            setIsHover(false);
        }
    };

    const handleFocus: React.FocusEventHandler<HTMLDivElement> = (event) => {
        if (event?.target === cardRef.current) {
            setIsHover(true);
        }
    };

    const handleBlur: React.FocusEventHandler<HTMLDivElement> = (event) => {
        if (event?.target === cardRef.current) {
            setIsHover(false);
        }
    };

    const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
        if (isTop) {
            onClick?.(event, card, source);
        }
    };

    const handleDoubleClick: React.MouseEventHandler<HTMLDivElement> = (
        event,
    ) => {
        if (isTop) {
            onDoubleClick?.(event, card, source);
        }
    };

    const handleDragStart: React.DragEventHandler<HTMLDivElement> = (event) => {
        if (event?.target === containerRef.current && event?.dataTransfer) {
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

    const handleDragEnd: React.DragEventHandler<HTMLDivElement> = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isHover && card.isRevealed) {
            setBorderColor("orange");
        } else {
            setBorderColor("black");
        }
    }, [isHover, card]);

    return (
        <AnimatedBox
            ref={containerRef}
            sx={{
                cursor: cursorStyle,
                display: "block",
                position: "absolute",
                top: !isBottom && isStackDown ? CARD_STACK_MARGIN : 0,
                left: 0,
                height: "100%",
                width: "100%",
                borderRadius: CARD_BORDER_RADIUS,
                boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.3)",
                perspective: 600,
                willChange: "transform, box-shadow",
                touchAction: "manipulation",
                opacity: isDragging ? "0.5" : "1",
                zIndex: !isBottom && isStackDown ? 3 : "auto",

                "@media (max-width: 768px)": {
                    top: !isBottom && isStackDown ? "auto" : CARD_STACK_MARGIN,
                    left: !isBottom && isStackDown ? CARD_STACK_MARGIN : 0,
                    // --card-border-color: transparent,
                },
            }}
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
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            <AnimatedBox
                ref={cardRef}
                sx={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    willChange: "transform",
                    transformOrigin: "center center",
                    transformStyle: "preserve-3d",
                    borderRadius: CARD_BORDER_RADIUS,
                    boxShadow: `0 0 ${
                        isFlipping && isTop ? "10px" : "0"
                    } rgba(0, 0, 0, 0.3)`,

                    ":before, :after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "100%",
                        zIndex: 2,
                        boxShadow: `inset 0 0 0 2px ${borderColor}`,
                        borderRadius: CARD_BORDER_RADIUS,
                    },

                    ":after": {
                        transform: "rotateY(180deg)",
                    },
                }}
                style={{ transform: transformRotate }}
                data-rank={card.rank}
                data-suit={card.suit}
                data-color={card.color}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
            >
                <Svg>
                    <use href={`#${card.id}`} />
                </Svg>
                <Svg sx={{ fill: "blue", transform: "rotateY(180deg)" }}>
                    <use href="#SvgCards__alternate-back" />
                </Svg>
            </AnimatedBox>
            {children}
        </AnimatedBox>
    );
};

export default CardElement;
