import { createRef, useMemo } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { Box, BoxProps } from "theme-ui";
import _reverse from "lodash/reverse";
import { useImmer } from "use-immer";

import { CardClickEvent, CardTransferObject, PileName } from "../types";
import Card from "../Card";
import Svg from "../elements/Svg";

export interface CardProps extends Omit<BoxProps, "onClick" | "onDoubleClick"> {
    card: Card;
    source: [PileName, number];
    isTop?: boolean;
    isBottom?: boolean;
    isStackDown?: boolean;
    childCards?: Card[];
    style?: any;
    onClick?: CardClickEvent;
    onDoubleClick?: CardClickEvent;
}

const AnimatedBox = animated(Box);

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
    sx,
    ...boxProps
}) => {
    const containerRef = createRef<HTMLDivElement>();
    const cardRef = createRef<HTMLDivElement>();

    const [isDragging, setIsDragging] = useImmer(false);

    const [isHover, setIsHover] = useImmer(false);

    const [isFlipping, setIsFlipping] = useImmer(false);

    const { transform: transformCard, boxShadow: boxShadowCard } = useSpring({
        transform: `rotateX(${card.isRevealed ? 0 : 180}deg)`,
        boxShadow: `0 0 ${isFlipping && isTop ? "10px" : 0} rgba(0, 0, 0, 0.3)`,
        config: config.stiff,
        onStart: () => setIsFlipping(true),
        onRest: () => setIsFlipping(false),
    });

    const { transform: transformContainer, boxShadow: boxShadowContainer } =
        useSpring({
            transform: `scale(${isHover && card.isRevealed ? "1.04" : "1"})`,
            boxShadow: `0 0 ${
                isHover && card.isRevealed ? "20px" : 0
            } rgba(0, 0, 0, 0.3)`,
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

    const handleDragEnd: React.DragEventHandler<HTMLDivElement> = (event) => {
        setIsDragging(false);
    };

    return (
        <AnimatedBox
            ref={containerRef}
            style={{
                ...style,
                boxShadow: boxShadowContainer,
                transform: transformContainer,
            }}
            draggable={card.isRevealed}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            onMouseOut={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            sx={{
                label: "DragContainer",
                cursor: cursorStyle,
                display: "block",
                position: "absolute",
                top: ["auto", !isBottom && isStackDown ? "12%" : 0],
                left: ["12%", 0],
                height: "100%",
                width: "100%",
                borderRadius: "8px",
                perspective: "400px",
                willChange: "transform, box-shadow",
                touchAction: "manipulation",
                opacity: isDragging ? 0.5 : 1,
                zIndex: !isBottom && isStackDown ? 3 : undefined,
                ...sx,
            }}
            {...boxProps}
        >
            <AnimatedBox
                ref={cardRef}
                style={{ transform: transformCard, boxShadow: boxShadowCard }}
                data-rank={card.rank}
                data-suit={card.suit}
                data-color={card.color}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                sx={{
                    label: "CardWrapper",
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    willChange: "transform",
                    transformOrigin: "center center",
                    transformStyle: "preserve-3d",
                    borderRadius: "8px",
                    "&:before, &:after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "100%",
                        zIndex: 2,
                        boxShadow: [
                            "none",
                            `inset 0 0 0 2px ${
                                isHover && card.isRevealed ? "orange" : "black"
                            }`,
                        ],
                        borderRadius: "8px",
                    },
                    "&:after": {
                        transform: "rotate(180deg)",
                    },
                }}
            >
                <Svg>
                    <use href={`#${card.id}`} />
                </Svg>
                <Svg
                    sx={{
                        fill: "blue",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <use href="#SvgCards__alternate-back" />
                </Svg>
            </AnimatedBox>
            {children}
        </AnimatedBox>
    );
};

export default CardElement;
