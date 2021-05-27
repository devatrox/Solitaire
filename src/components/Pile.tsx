/** @jsx jsx */

import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import _noop from "lodash/noop";
import _reverse from "lodash/reverse";
import CardElement from "./CardElement";
import { PileProps, CardProps } from "../definitions";

const Pile: React.FC<PileProps> = ({
    cards,
    name,
    index = 0,
    stackDown = false,
    onDrop = _noop,
    onCardClick,
    onCardDoubleClick,
    onClick = _noop,
}) => {
    const [isHover, setIsHover] = useState(false);

    const styles = css`
        position: relative;
        width: var(--card-width);
        height: 0;
        padding-bottom: var(--card-height);
        border: 2px solid rgba(255, 255, 255, 0.3);
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: var(--card-border-radius);
    `;

    let enterTarget: EventTarget | null = null;

    const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();

        onDrop(event, [name, index]);
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>): void => {
        enterTarget = event.target;
        setIsHover(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
        if (enterTarget === event.target) {
            event.stopPropagation();
            event.preventDefault();
            setIsHover(false);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        if ([...event.dataTransfer.types].includes("text/plain")) {
            // This is necessary so the element works as a drop target
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const handleClick = (event: React.SyntheticEvent): void => {
        if (cards.length === 0) {
            onClick(event, name);
        }
    };

    // Put cards into each other
    const renderStackedDownCards = (): JSX.Element | null => {
        const reversedCards = _reverse([...cards]);

        return reversedCards.reduce(
            (lastCard: JSX.Element | null, card, i, cds): JSX.Element => {
                const cardProps: CardProps = {
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
    };

    const renderStackedUpCards = (): JSX.Element[] =>
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
        ));

    return (
        <div
            css={styles}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onClick={handleClick}
        >
            {stackDown ? renderStackedDownCards() : renderStackedUpCards()}
        </div>
    );
};

export default Pile;
