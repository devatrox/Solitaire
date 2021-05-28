/** @jsx jsx */

import React, { PropsWithChildren, useMemo, useState } from "react";
import { jsx, css } from "@emotion/react";
import _reverse from "lodash/reverse";
import CardElement from "./CardElement";
import { PileProps, CardProps } from "../definitions";

const Pile: React.FC<PileProps> = ({
    cards,
    name,
    index = 0,
    stackDown = false,
    onDrop,
    onCardClick,
    onCardDoubleClick,
    onClick,
}) => {
    const [isHover, setIsHover] = useState(false);

    const styles = useMemo(
        () => css`
            position: relative;
            width: var(--card-width);
            height: 0;
            padding-bottom: var(--card-height);
            border: 2px solid rgba(255, 255, 255, 0.3);
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: var(--card-border-radius);
        `,
        [],
    );

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
        if (cards.length === 0) {
            onClick?.(event, name);
        }
    };

    // Put cards into each other
    const renderStackedDownCards = useMemo(() => {
        const reversedCards = _reverse([...cards]);

        return reversedCards.reduce<React.ReactNode>(
            (lastCard, card, i, cds) => {
                const cardProps: PropsWithChildren<CardProps> = {
                    card: card,
                    childCards: cds.slice(0, i),
                    source: [name, index],
                    isBottom: reversedCards.length - 1 === i,
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
            },
            null,
        );
    }, [cards, index, name, onCardClick, onCardDoubleClick]);

    const renderStackedUpCards = useMemo(
        () =>
            cards.map((card, i) => (
                <CardElement
                    card={card}
                    source={[name, index]}
                    isBottom={i === 0}
                    isTop={cards.length - 1 === i}
                    key={card.id}
                    onClick={onCardClick}
                    onDoubleClick={onCardDoubleClick}
                />
            )),
        [cards, index, name, onCardClick, onCardDoubleClick],
    );

    return (
        <div
            css={styles}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onClick={handleClick}
        >
            {stackDown ? renderStackedDownCards : renderStackedUpCards}
        </div>
    );
};

export default Pile;
