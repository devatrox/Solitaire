import { WritableDraft } from "immer";
import {
    Suit,
    GameState,
    PileGroupName,
    ActionType,
    Action,
    ActionPayloadSourceName,
    ActionPayloadTargetName,
    MappedCard,
} from "./types";
import Card from "./Card";
import { createInitialState } from "./setup";

const getFoundationIndexBySuit = (card: Card): number => {
    let targetIndex = 0;

    if (card.suit === Suit.Heart) {
        targetIndex = 1;
    }

    if (card.suit === Suit.Diamond) {
        targetIndex = 2;
    }

    if (card.suit === Suit.Club) {
        targetIndex = 3;
    }

    return targetIndex;
};

const moveCardsAction = (
    draft: GameState,
    mappedCards: MappedCard[],
    sourceName: ActionPayloadSourceName,
    targetName: ActionPayloadTargetName,
) => {
    const newSource = draft[sourceName];
    const newTarget = draft[targetName];

    for (const mappedCard of mappedCards) {
        const [sourceCard, sourceIndex, targetIndex] = mappedCard;
        console.log("moveCardsAction", sourceCard.rank, sourceCard.suit);

        newSource[sourceIndex].cards = newSource[sourceIndex].cards.filter(
            (card) => card.id !== sourceCard.id,
        );

        newTarget[targetIndex].cards.push(sourceCard);

        if (targetName === sourceName) {
            newTarget[sourceIndex] = newSource[sourceIndex];
        }
    }
};

const finishAction = (draft: GameState) => {
    const groupNames = [
        PileGroupName.STOCK,
        PileGroupName.WASTE,
        PileGroupName.TABLEAU,
    ];

    for (const pileGroup of groupNames) {
        const pile = draft[pileGroup];
        const mappedCards = pile
            .map((pile, pileIndex) =>
                pile.cards.map<MappedCard>((card) => {
                    const targetIndex = getFoundationIndexBySuit(card);
                    card.reveal();
                    return [card, pileIndex, targetIndex];
                }),
            )
            .flat();

        moveCardsAction(
            draft,
            mappedCards,
            pileGroup,
            PileGroupName.FOUNDATION,
        );
    }

    for (const pile of draft.foundation) {
        pile.cards.sort((a, b) => a.rank - b.rank);
    }
};

const flipCardAction = (
    draft: GameState,
    mappedCards: MappedCard[],
    targetName: ActionPayloadTargetName,
) => {
    const newTarget = draft[targetName];

    for (const mappedCard of mappedCards) {
        const [targetCard, , targetIndex] = mappedCard;
        const cardToBeFlipped = newTarget[targetIndex].cards.find(
            (card) => card.id === targetCard.id,
        );
        console.log(
            "flipCardAction",
            cardToBeFlipped?.rank,
            cardToBeFlipped?.suit,
        );

        if (cardToBeFlipped) {
            cardToBeFlipped.flip();
        }
    }
};

const resetAction = (draft: GameState) => {
    const newState = createInitialState();
    draft.stock = newState.stock;
    draft.waste = newState.waste;
    draft.foundation = newState.foundation;
    draft.tableau = newState.tableau;
};

const reducer = (draft: GameState, { type, payload }: Action) => {
    switch (type) {
        case ActionType.MOVE_CARDS:
            if (payload?.cards && payload?.sourcePile && payload?.targetPile) {
                moveCardsAction(
                    draft,
                    payload.cards,
                    payload.sourcePile,
                    payload.targetPile,
                );
            }
            break;
        case ActionType.FINISH:
            finishAction(draft);
            break;
        case ActionType.FLIP_CARD:
            if (payload?.cards && payload?.targetPile) {
                flipCardAction(draft, payload.cards, payload.targetPile);
            }
            break;
        case ActionType.RESET:
            resetAction(draft);
            break;
        // case ActionTypes.CHAIN:
        //     resetAction(draft);
        //     break;
        default:
            break;
    }
};

export default reducer;
export { getFoundationIndexBySuit };
