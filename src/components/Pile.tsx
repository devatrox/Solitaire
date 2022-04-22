import { PropsWithChildren, useMemo, useState } from "react";
import _reverse from "lodash/reverse";
import { Box, BoxProps } from "theme-ui";
import { useTransition } from "@react-spring/web";

import CardElement, { CardProps } from "./CardElement";
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
    const sortedCards = useMemo(
        () => (stackDown ? _reverse([...cards]) : cards),
        [cards, stackDown],
    );
    const transitions = useTransition(sortedCards, {
        from: { transform: `scale(1.1)` },
        enter: { transform: `scale(1)` },
        leave: { transform: `scale(1.1)` },
    });

    let enterTarget: EventTarget;

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        onDrop?.(event, [name, index]);
    };

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
        if ([...event.dataTransfer.types].includes("text/plain")) {
            // This is necessary so the element works as a drop target
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const handleClick = (event: React.SyntheticEvent) => {
        if (sortedCards.length === 0) {
            onClick?.(event, name);
        }
    };

    // Put cards into each other
    const renderStackedDownCards = useMemo(() => {
        return sortedCards.reduce<React.ReactNode>((lastCard, card, i, cds) => {
            const cardProps: PropsWithChildren<CardProps> = {
                card: card,
                childCards: cds.slice(0, i),
                source: [name, index],
                isBottom: sortedCards.length - 1 === i,
                isTop: false,
                isStackDown: true,
                key: card.id,
                onClick: onCardClick,
                onDoubleClick: onCardDoubleClick,
            };

            if (lastCard) {
                cardProps.children = lastCard;
            } else {
                cardProps.isTop = true;
            }

            return <CardElement {...cardProps} />;
        }, null);
    }, [sortedCards, index, name, onCardClick, onCardDoubleClick]);

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
