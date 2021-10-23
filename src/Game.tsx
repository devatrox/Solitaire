import React, { useReducer, useEffect, useMemo, useState } from "react";
import _last from "lodash/last";
import _reverse from "lodash/reverse";
import PileGroup from "./components/PileGroup";
import {
    PileName,
    ActionTypes,
    CardTransferObject,
    MappedCard,
    CardClickEvent,
    DropEvent,
    MenuEvent,
    PileClickEvent,
    GameState,
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
    validateMultiple,
    isKingOnEmpty,
    validResult,
} from "./rules";
import { Box, Grid } from "@theme-ui/components";
import { GAP } from "./theme";

export interface GameProps {
    initialState: GameState;
}

const Game: React.FC<GameProps> = ({ initialState }) => {
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
        const { status, statusText } = validateMultiple(
            [card],
            foundation[targetIndex],
            [isLowerRank],
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
            let validationResult = validResult;

            if (targetName === PileName.TABLEAU) {
                validationResult = validateMultiple(
                    cards,
                    tableau[targetIndex],
                    [isHigherRank, isDifferentColor, isKingOnEmpty],
                );
            }

            if (targetName === PileName.FOUNDATION) {
                validationResult = validateMultiple(
                    cards,
                    foundation[targetIndex],
                    [isLowerRank],
                );
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
        <Box
            sx={{
                position: "fixed",
                overflow: "hidden",
                width: "100%",
            }}
        >
            <Grid
                sx={{
                    height: "100vh",
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: `${GAP} ${GAP} 80px`,
                    gridGap: GAP,
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gridTemplateRows: "auto 1fr",
                    gridTemplateAreas:
                        '"stock waste . foundation foundation foundation foundation" "tableau tableau tableau tableau tableau tableau tableau"',

                    "@media (max-width: 768px)": {
                        gridTemplateColumns: "auto 1fr",
                        gridTemplateRows: "repeat(7, 1fr)",
                        gridTemplateAreas:
                            '"stock tableau" "waste tableau" ". tableau" "foundation tableau" "foundation tableau" "foundation tableau" "foundation tableau"',
                        paddingBottom: 100,
                    },
                }}
            >
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
            </Grid>
            <Menu
                message={message}
                isDone={isDone}
                isFinished={isFinished}
                onReset={handleReset}
                onFinish={handleFinish}
            />
        </Box>
    );
};

export default Game;
