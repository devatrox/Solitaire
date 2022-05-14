import { useEffect, useCallback } from "react";
import { Flex, Grid } from "theme-ui";
import _last from "lodash/last";
import _reverse from "lodash/reverse";
import { useImmerReducer } from "use-immer";

import PileGroup from "./components/PileGroup";
import {
    PileGroupName,
    ActionType,
    CardTransferObject,
    MappedCard,
    CardClickEvent,
    DropEvent,
    PileClickEvent,
    GameState,
    Action,
} from "./types";
import { cardCount } from "./setup";
import reducer, { getFoundationIndexBySuit } from "./reducer";
import Card from "./Card";
import Menu from "./components/Menu";
import {
    isLowerRank,
    isHigherRank,
    isDifferentColor,
    isAllRevealed,
    validateMultiple,
    isKingOnEmpty,
    validResult,
} from "./rules";
import useMessage from "./hooks/useMessage";

export interface GameProps {
    initialState: GameState;
}

const Game: React.FC<GameProps> = ({ initialState }) => {
    const [{ stock, waste, foundation, tableau }, dispatch] =
        useImmerReducer<GameState>(reducer, initialState);

    const [message, setMessage] = useMessage();

    const isDone = tableau.every((pile) =>
        pile.cards.every((card) => card.isRevealed),
    );

    const isFinished = foundation.flat().length === cardCount;

    const handleStockClick: PileClickEvent = useCallback(() => {
        const mappedCards = waste[0].cards.map(
            (card): MappedCard => [card, 0, 0],
        );
        const reversedWasteCards = _reverse(mappedCards);

        dispatch({
            type: ActionType.MOVE_CARDS,
            payload: {
                cards: reversedWasteCards,
                sourcePile: PileGroupName.WASTE,
                targetPile: PileGroupName.STOCK,
            },
        });
    }, [waste, dispatch]);

    const handleStockCardClick: CardClickEvent = useCallback(
        (event, card) => {
            dispatch({
                type: ActionType.MOVE_CARDS,
                payload: {
                    cards: [[card, 0, 0]],
                    sourcePile: PileGroupName.STOCK,
                    targetPile: PileGroupName.WASTE,
                },
            });
        },
        [dispatch],
    );

    const handleCardDoubleClick: CardClickEvent = useCallback(
        (event, card, source) => {
            const [sourceName, sourceIndex] = source;
            const targetIndex = getFoundationIndexBySuit(card);
            const { status, statusText } = validateMultiple(
                [card],
                foundation[targetIndex].cards,
                [isLowerRank],
            );

            if (status) {
                dispatch({
                    type: ActionType.MOVE_CARDS,
                    payload: {
                        cards: [[card, sourceIndex, targetIndex]],
                        sourcePile: sourceName,
                        targetPile: PileGroupName.FOUNDATION,
                    },
                });
            } else {
                setMessage(statusText);
            }
        },
        [foundation, setMessage, dispatch],
    );

    const handleDrop: DropEvent = useCallback(
        (event, target) => {
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

                if (targetName === PileGroupName.TABLEAU) {
                    validationResult = validateMultiple(
                        cards,
                        tableau[targetIndex].cards,
                        [isHigherRank, isDifferentColor, isKingOnEmpty],
                    );
                }

                if (targetName === PileGroupName.FOUNDATION) {
                    validationResult = validateMultiple(
                        cards,
                        foundation[targetIndex].cards,
                        [isLowerRank],
                    );
                }

                const { status, statusText } = validationResult;

                if (status) {
                    dispatch({
                        type: ActionType.MOVE_CARDS,
                        payload: {
                            cards: mappedCards,
                            sourcePile: sourceName,
                            targetPile: targetName,
                        },
                    });
                } else {
                    setMessage(statusText);
                }
            } catch (error) {
                console.error(error);
            }
        },
        [foundation, setMessage, tableau, dispatch],
    );

    const handleReset: React.MouseEventHandler<HTMLButtonElement> = () => {
        dispatch({
            type: ActionType.RESET,
        });
    };

    const handleFinish: React.MouseEventHandler<HTMLButtonElement> =
        useCallback(() => {
            const validationResult = isAllRevealed(tableau);
            console.log({ validationResult });

            const { status, statusText } = validationResult;

            if (status) {
                dispatch({
                    type: ActionType.FINISH,
                });
            } else {
                setMessage(statusText);
            }
        }, [tableau, setMessage, dispatch]);

    useEffect(() => {
        if (isFinished) {
            setMessage("Congratulations!");
        }
    }, [isFinished, setMessage]);

    useEffect(() => {
        tableau.forEach((pile, i) => {
            const topCard = _last(pile.cards);

            if (topCard && !topCard.isRevealed) {
                console.log(1);
                dispatch({
                    type: ActionType.FLIP_CARD,
                    payload: {
                        cards: [[topCard, i, i]],
                        targetPile: PileGroupName.TABLEAU,
                    },
                });
            }
        });
    }, [tableau, dispatch]);

    useEffect(() => {
        const wastePile = waste[0];
        const topStockCard = _last(stock[0].cards);

        if (wastePile.cards.length === 0 && topStockCard) {
            // if waste is empty and stock has < 0 cards
            console.log(2);
            dispatch({
                type: ActionType.MOVE_CARDS,
                payload: {
                    cards: [[topStockCard, 0, 0]],
                    sourcePile: PileGroupName.STOCK,
                    targetPile: PileGroupName.WASTE,
                },
            });
        }
    }, [stock, waste, dispatch]);

    useEffect(() => {
        const pile = waste[0];

        for (const card of pile.cards) {
            console.log(3, card.suit, card.rank, card.isRevealed);
            if (!card.isRevealed) {
                dispatch({
                    type: ActionType.FLIP_CARD,
                    payload: {
                        cards: [[card, 0, 0]],
                        targetPile: PileGroupName.WASTE,
                    },
                });
            }
        }
    }, [waste, dispatch]);

    useEffect(() => {
        const pile = stock[0];

        for (const card of pile.cards) {
            if (card.isRevealed) {
                console.log(4, card.suit, card.rank);
                dispatch({
                    type: ActionType.FLIP_CARD,
                    payload: {
                        cards: [[card, 0, 0]],
                        targetPile: PileGroupName.STOCK,
                    },
                });
            }
        }
    }, [stock, dispatch]);

    return (
        <Flex
            sx={{
                flexDirection: "column",
                padding: [2, 3],
                gap: [2, 3],
                height: "100vh",
            }}
        >
            <Grid
                sx={{
                    flex: "1 1 auto",
                    width: "100%",
                    maxWidth: "1200px",
                    marginY: 0,
                    marginX: "auto",
                    gap: [2, 3],
                    gridTemplateColumns: ["auto 1fr", "repeat(7, 1fr)"],
                    gridTemplateRows: ["repeat(7, 1fr)", "auto 1fr"],
                    gridTemplateAreas: [
                        '"stock tableau" "waste tableau" ". tableau" "foundation tableau" "foundation tableau" "foundation tableau" "foundation tableau"',
                        '"stock waste . foundation foundation foundation foundation" "tableau tableau tableau tableau tableau tableau tableau"',
                    ],
                }}
            >
                <PileGroup
                    name={PileGroupName.STOCK}
                    piles={stock}
                    onPileClick={handleStockClick}
                    onCardClick={handleStockCardClick}
                />
                <PileGroup
                    name={PileGroupName.WASTE}
                    piles={waste}
                    onCardDoubleClick={handleCardDoubleClick}
                />
                <PileGroup
                    name={PileGroupName.FOUNDATION}
                    piles={foundation}
                    onDrop={handleDrop}
                />
                <PileGroup
                    name={PileGroupName.TABLEAU}
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
        </Flex>
    );
};

export default Game;
