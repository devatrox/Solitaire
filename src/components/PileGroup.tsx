import React from "react";
import Pile from "./Pile";
import { GenericPileProps, PileClickEvent, PileName } from "../definitions";
import Card from "../Card";
import { Box } from "@theme-ui/components";
import { GAP } from "../theme";

export interface GroupProps extends GenericPileProps {
    piles: Card[][];
    onPileClick?: PileClickEvent;
}

const PileGroup: React.FC<GroupProps> = ({
    piles = [],
    name,
    stackDown,
    onDrop,
    onCardClick,
    onCardDoubleClick,
    onPileClick,
}) => (
    <Box
        sx={{
            gridArea: name,
            position: "relative",
            display:
                name === PileName.FOUNDATION || name === PileName.TABLEAU
                    ? "grid"
                    : "block",
            gridGap: GAP,
            gridTemplateColumns:
                name === PileName.FOUNDATION
                    ? "repeat(4, 1fr)"
                    : name === PileName.TABLEAU
                    ? "repeat(7, 1fr)"
                    : "auto",
            "@media (max-width: 768px)": {
                gridTemplateColumns: "auto",
                gridTemplateRows:
                    name === PileName.FOUNDATION
                        ? "repeat(4, 1fr)"
                        : name === PileName.TABLEAU
                        ? "repeat(7, 1fr)"
                        : "auto",
            },
        }}
    >
        {piles.map((pile, i) => (
            <Pile
                name={name}
                cards={pile}
                index={i}
                stackDown={stackDown}
                onClick={onPileClick}
                onDrop={onDrop}
                onCardClick={onCardClick}
                onCardDoubleClick={onCardDoubleClick}
                key={i} // eslint-disable-line react/no-array-index-key
            />
        ))}
    </Box>
);

export default PileGroup;
