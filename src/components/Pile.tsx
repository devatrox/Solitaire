import React, { useState } from 'react';
import classnames from 'classnames';
import _noop from 'lodash/noop';
import _reverse from 'lodash/reverse';
import CardElement from './CardElement';
import { PileProps, CardProps } from '../definitions';

const Pile = (props: PileProps): JSX.Element => {
    const {
        cards,
        name,
        index = 0,
        stackDown = false,
        onDrop = _noop,
        onCardClick,
        onCardDoubleClick,
        onClick = _noop
    } = props;

    const [isHover, setIsHover] = useState(false);

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
        if ([...event.dataTransfer.types].includes('text/plain')) {
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

        return reversedCards.reduce((lastCard: JSX.Element | null, card, i, cds): JSX.Element => {
            const cardProps: CardProps = {
                card: card,
                childCards: cds.slice(0, i),
                source: [name, index],
                isTop: false,
                key: card.id,
                onClick: onCardClick,
                onDoubleClick: onCardDoubleClick
            };

            if (lastCard) {
                cardProps.children = lastCard;
            } else {
                cardProps.isTop = true;
            }

            return <CardElement {...cardProps} />;
        }, null);
    };

    const renderStackedUpCards = (): JSX.Element[] => cards.map((card, i) => (
        <CardElement
            card={card}
            source={[name, index]}
            isTop={(cards.length - 1) === i}
            key={card.id}
            onClick={onCardClick}
            onDoubleClick={onCardDoubleClick}
        />
    ));

    return (
        <div
            className={classnames(
                `${name}-pile`,
                'pile',
                isHover ? 'is-hover' : null
            )}
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
