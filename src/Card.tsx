import React, { useState } from 'react';
import classnames from 'classnames';
import _noop from 'lodash/noop';
import { Suit, Color, CardProps, CardTransferObject } from './definitions';

const backCardSymbol = String.fromCodePoint(Number('0x0001F0A0'));

interface CardInterface {
    suit: string
    rank: string
    revealed: boolean
    color: Color
}

class Card implements CardInterface {
    color: Color = Color.BLACK

    constructor(public suit: string, public rank: string, public revealed: boolean = false) {
        if (this.suit === Suit.Diamond || this.suit === Suit.Heart) {
            this.color = Color.RED;
        }
    }

    get id() {
        return this.suit + this.rank;
    }

    get symbol() {
        return String.fromCodePoint(Number('0x0001F0' + this.id));
    }

    static fromJSON(json: CardInterface): Card {
        return new Card(json.suit, json.rank, json.revealed);
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
        source,
        style,
        onClick = _noop,
        onDoubleClick = _noop
    } = props;

    const [isDragging, setIsDragging] = useState(false);

    const handleClick = (event: React.SyntheticEvent) => {
        onClick(event, card);
    }

    const handleDoubleClick = (event: React.SyntheticEvent) => {
        onDoubleClick(event, card, source);
    }

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        if (event && event.dataTransfer) {
            const payload: CardTransferObject = {
                source: source,
                card: card
            };
            event.dataTransfer.setData('text/plain', JSON.stringify(payload));
            event.dataTransfer.effectAllowed = 'move'; // eslint-disable-line no-param-reassign
        }

        setIsDragging(true);
    };

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(false);
    };

    return (
        <div
            className={classnames(
                'card',
                'card-' + card.color,
                isDragging ? 'is-dragging' : null,
                card.revealed ? 'is-revealed' : null
            )}
            style={style}
            draggable={card.revealed}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {!card.revealed ? backCardSymbol : card.symbol}
        </div>
    )
}

export default CardElement;
export {
    Card
}
