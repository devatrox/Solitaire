import React, { useState } from 'react';
import classnames from 'classnames';
import _noop from 'lodash/noop';
import { Suit, Color, CardProps } from './definitions';

const flippedCardSymbol = String.fromCodePoint(Number('0x0001F0A0'));

interface CardInterface {
    suit: string
    rank: string
    flipped: boolean
    color: Color
}

class Card implements CardInterface {
    color: Color = 'black'

    constructor(public suit: string, public rank: string, public flipped: boolean = true) {
        if (this.suit === Suit.Diamond || this.suit === Suit.Heart) {
            this.color = 'red';
        }
    }

    get id() {
        return this.suit + this.rank;
    }

    get symbol() {
        return String.fromCodePoint(Number('0x0001F0' + this.id));
    }

    static fromJSON(json: CardInterface): Card {
        return new Card(json.suit, json.rank, json.flipped);
    }

    static fromString = (jsonString: string): Card => {
        try {
            const json = JSON.parse(jsonString);
            return Card.fromJSON(json);
        } catch (e) {
            throw new Error(e);
        }
    }
}

const CardElement = (props: CardProps) => {
    const {
        card,
        style,
        onClick = _noop,
        onDrop = _noop
    } = props;

    const [isHover, setIsHover] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    let enterTarget: EventTarget | null = null;

    const handleClick = (event: React.SyntheticEvent) => {
        onClick(event, card);
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (event && event.dataTransfer) {
            event.dataTransfer.setData('text/plain', JSON.stringify(card));
            event.dataTransfer.effectAllowed = 'move'; // eslint-disable-line no-param-reassign
        }

        setIsDragging(true);
    };

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        setIsHover(false);
        onDrop(event, card);
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
        if ([...event.dataTransfer.types].includes('text/plain')) {
            // This is necessary so the element works as a drop target
            event.preventDefault();
            event.stopPropagation();
        }
    };

    return (
        <div
            className={classnames(
                'card',
                'card-' + card.color,
                isDragging ? 'is-dragging' : null,
                isHover ? 'is-hover' : null,
                card.flipped ? 'card-flipped' : null
            )}
            style={style}
            draggable={!card.flipped}
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {card.flipped ? flippedCardSymbol : card.symbol}
        </div>
    )
}

export default CardElement;
export {
    Card
}
