import { useMemo, useState, useRef } from "react";
import _reverse from "lodash/reverse";
import { Box, BoxProps } from "theme-ui";
import { useTransition } from "@react-spring/web";

import CardElement from "./CardElement";
import Card from "../Card";
import { GenericPileProps, PileClickEvent } from "../types";

export interface PileProps
    extends GenericPileProps,
        Omit<BoxProps, "name" | "onDrop" | "onClick"> {
    cards: Card[];
    index?: number;
    onClick?: PileClickEvent;
}

const Pile: React.FC<PileProps> = ({
    cards,
    name,
    index = 0,
    stackDown = false,
    onDrop,
    onCardClick,
    onCardDoubleClick,
    onClick,
    sx,
    ...boxProps
}) => {
    const [isHover, setIsHover] = useState(false);

    const dropTarget = useRef<EventTarget>();

    const sortedCards = useMemo(
        () => (stackDown ? _reverse([...cards]) : cards),
        [cards, stackDown],
    );
    const transitions = useTransition(sortedCards, {
        from: { transform: `scale(1.1)` },
        enter: { transform: `scale(1)` },
        leave: { transform: `scale(1.1)` },
    });

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();

        onDrop?.(event, [name, index]);
    };

    const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (event) => {
        dropTarget.current = event.target;
        setIsHover(true);
    };

    const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (event) => {
        if (dropTarget.current === event.target) {
            event.stopPropagation();
            event.preventDefault();
            setIsHover(false);
        }
    };

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
        if ([...event.dataTransfer.types].includes("text/plain")) {
            // This is necessary so the element works as a drop target
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
        if (sortedCards.length === 0) {
            onClick?.(event, name);
        }
    };

    // Put cards into each other
    const renderStackedDownCards = useMemo(
        () =>
            sortedCards.reduce<React.ReactNode>(
                (previousCard, card, i, originalCards) => (
                    <CardElement
                        card={card}
                        childCards={originalCards.slice(0, i)}
                        source={[name, index]}
                        isBottom={sortedCards.length - 1 === i}
                        isTop={!previousCard}
                        isStackDown
                        onClick={onCardClick}
                        onDoubleClick={onCardDoubleClick}
                        key={card.id}
                    >
                        {previousCard}
                    </CardElement>
                ),
                null,
            ),
        [sortedCards, index, name, onCardClick, onCardDoubleClick],
    );

    const renderStackedUpCards = useMemo(
        () =>
            transitions((styles, card, transition, i) => (
                <CardElement
                    card={card}
                    source={[name, index]}
                    isBottom={i === 0}
                    isTop={sortedCards.length - 1 === i}
                    style={styles}
                    key={card.id}
                    onClick={onCardClick}
                    onDoubleClick={onCardDoubleClick}
                />
            )),
        [
            transitions,
            index,
            name,
            sortedCards.length,
            onCardClick,
            onCardDoubleClick,
        ],
    );

    return (
        <Box
            sx={{
                position: "relative",
                width: ["7vh", "100%"],
                height: 0,
                paddingBottom: "140%",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "8px",
                perspective: "600px",
                ...sx,
            }}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onClick={handleClick}
            {...boxProps}
        >
            {stackDown ? renderStackedDownCards : renderStackedUpCards}
        </Box>
    );
};

export default Pile;
