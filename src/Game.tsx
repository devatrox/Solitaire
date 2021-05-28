/** @jsx jsx */

import React, {
    useReducer,
    useEffect,
    useMemo,
    useState,
    Fragment,
} from "react";
import _last from "lodash/last";
import _reverse from "lodash/reverse";
import { jsx, css } from "@emotion/react";
import PileGroup from "./components/PileGroup";
import {
    PileName,
    GameProps,
    ActionTypes,
    CardTransferObject,
    MappedCard,
    CardClickEvent,
    DropEvent,
    MenuEvent,
    PileClickEvent,
} from "./definitions";
import { cardCount } from "./setup";
import reducer, { getFoundationTargetIndex } from "./reducer";
import Card from "./Card";
import Menu from "./components/Menu";
import {
    isLowerRank,
    isHigherRank,
    isDifferentColor,
    isAllRevealed,
    hasNoStock,
} from "./rules";

const Game: React.FC<GameProps> = ({ initialState }) => {
    const styles = useMemo(
        () => css`
            height: 100vh;
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--grid-gap) var(--grid-gap) 80px;
            display: grid;
            grid-gap: var(--grid-gap);
            grid-template-columns: repeat(7, 1fr);
            grid-template-rows: auto 1fr;
            grid-template-areas:
                "stock waste . foundation foundation foundation foundation"
                "tableau tableau tableau tableau tableau tableau tableau";

            @media (max-width: 768px) {
                grid-template-columns: auto 1fr;
                grid-template-rows: repeat(7, 1fr);
                grid-template-areas:
                    "stock tableau"
                    "waste tableau"
                    ". tableau"
                    "foundation tableau"
                    "foundation tableau"
                    "foundation tableau"
                    "foundation tableau";
                padding-bottom: 100px;
            }
        `,
        [],
    );

    const [{ stock, waste, foundation, tableau }, dispatch] = useReducer(
        reducer,
        initialState,
    );

    const [message, setMessage] = useState("");

    const isDone = useMemo<boolean>(() => {
        const allCards = [...stock, ...waste, ...foundation].flat();
        const isRevealed = allCards.every((card) => card.isRevealed);
        const isStockAndWasteEmpty =
            stock[0].length === 0 && waste[0].length === 0;
        return isStockAndWasteEmpty && isRevealed;
    }, [foundation, stock, waste]);

    const isFinished = useMemo<boolean>(() => {
        const allTableauCards = foundation.flat();
        return allTableauCards.length === cardCount;
    }, [foundation]);

    useEffect(() => {
        if (message.length > 0) {
            window.setTimeout(() => setMessage(""), 4000);
        }
    }, [message]);

    useEffect(() => {
        if (isFinished) {
            setMessage("Congratulations!");
        }
    }, [isFinished]);

    useEffect(() => {
        tableau.forEach((pile, i) => {
            const topCard = _last(pile);

            if (topCard && !topCard.isRevealed) {
                dispatch({
                    type: ActionTypes.FLIP_CARD,
                    payload: {
                        cards: [[topCard, i, i]],
                        targetPile: PileName.TABLEAU,
                    },
                });
            }
        });
    }, [tableau]);

    useEffect(() => {
        const pile = waste[0];
        const topCard = _last(stock[0]);

        if (pile.length === 0 && topCard) {
            dispatch({
                type: ActionTypes.MOVE_CARDS,
                payload: {
                    cards: [[topCard, 0, 0]],
                    sourcePile: PileName.STOCK,
                    targetPile: PileName.WASTE,
                },
            });
        } else {
            for (const card of pile) {
                if (!card.isRevealed) {
                    dispatch({
                        type: ActionTypes.FLIP_CARD,
                        payload: {
                            cards: [[card, 0, 0]],
                            targetPile: PileName.WASTE,
                        },
                    });
                }
            }
        }
    }, [stock, waste]);

    useEffect(() => {
        const pile = stock[0];

        for (const card of pile) {
            if (card.isRevealed) {
                dispatch({
                    type: ActionTypes.FLIP_CARD,
                    payload: {
                        cards: [[card, 0, 0]],
                        targetPile: PileName.STOCK,
                    },
                });
            }
        }
    }, [stock]);

    const handleStockClick: PileClickEvent = () => {
        const mappedCards = waste[0].map((card): MappedCard => [card, 0, 0]);
        const reversedWasteCards = _reverse(mappedCards);

        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                cards: reversedWasteCards,
                sourcePile: PileName.WASTE,
                targetPile: PileName.STOCK,
            },
        });
    };

    const handleStockCardClick: CardClickEvent = (event, card) => {
        dispatch({
            type: ActionTypes.MOVE_CARDS,
            payload: {
                cards: [[card, 0, 0]],
                sourcePile: PileName.STOCK,
                targetPile: PileName.WASTE,
            },
        });
    };

    const handleCardDoubleClick: CardClickEvent = (event, card, source) => {
        const [sourceName, sourceIndex] = source;
        const targetIndex = getFoundationTargetIndex(card);
        const { status, statusText } = isLowerRank(
            [card],
            foundation[targetIndex],
        );

        if (status) {
            dispatch({
                type: ActionTypes.MOVE_CARDS,
                payload: {
                    cards: [[card, sourceIndex, targetIndex]],
                    sourcePile: sourceName,
                    targetPile: PileName.FOUNDATION,
                },
            });
        }

        setMessage(statusText);
    };

    const handleDrop: DropEvent = (event, target) => {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        const [targetName, targetIndex] = target;

        try {
            const json: CardTransferObject = JSON.parse(data);
            const [sourceName, sourceIndex] = json.source;

            const cards: Card[] = json.cards.map((cardJson) =>
                Card.fromJSON(cardJson),
            );
            const mappedCards: MappedCard[] = cards.map((card) => [
                card,
                sourceIndex,
                targetIndex,
            ]);
            let validationResult = { status: true, statusText: "" };

            if (targetName === PileName.TABLEAU) {
                validationResult = isHigherRank(cards, tableau[targetIndex]);

                if (validationResult.status) {
                    validationResult = isDifferentColor(
                        cards,
                        tableau[targetIndex],
                    );
                }
            }

            if (targetName === PileName.FOUNDATION) {
                validationResult = isLowerRank(cards, foundation[targetIndex]);
            }

            const { status, statusText } = validationResult;

            if (status) {
                dispatch({
                    type: ActionTypes.MOVE_CARDS,
                    payload: {
                        cards: mappedCards,
                        sourcePile: sourceName,
                        targetPile: targetName,
                    },
                });
            }

            setMessage(statusText);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReset: MenuEvent = () => {
        dispatch({
            type: ActionTypes.RESET,
        });
    };

    const handleFinish: MenuEvent = () => {
        let validationResult = hasNoStock(stock[0], waste[0]);

        if (validationResult.status) {
            validationResult = isAllRevealed(tableau);
        }

        const { status, statusText } = validationResult;

        if (status) {
            dispatch({
                type: ActionTypes.FINISH,
            });
        }

        setMessage(statusText);
    };

    return (
        <Fragment>
            <div css={styles}>
                <PileGroup
                    name={PileName.STOCK}
                    piles={stock}
                    onPileClick={handleStockClick}
                    onCardClick={handleStockCardClick}
                />
                <PileGroup
                    name={PileName.WASTE}
                    piles={waste}
                    onCardDoubleClick={handleCardDoubleClick}
                />
                <PileGroup
                    name={PileName.FOUNDATION}
                    piles={foundation}
                    onDrop={handleDrop}
                />
                <PileGroup
                    name={PileName.TABLEAU}
                    piles={tableau}
                    stackDown
                    onDrop={handleDrop}
                    onCardDoubleClick={handleCardDoubleClick}
                />
            </div>
            <Menu
                message={message}
                isDone={isDone}
                isFinished={isFinished}
                onReset={handleReset}
                onFinish={handleFinish}
            />
        </Fragment>
    );
};

export default Game;
