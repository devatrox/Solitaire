import { Box, ThemeUIStyleObject } from "theme-ui";
import _capitalize from "lodash/capitalize";

import Pile from "./Pile";
import {
    GenericPileProps,
    PileClickEvent,
    PileGroupName,
    PileGroupType,
} from "../types";
import { forwardRef } from "react";

export interface GroupProps extends GenericPileProps {
    piles: PileGroupType;
    onPileClick?: PileClickEvent;
}

const foundationStyles: ThemeUIStyleObject = {
    display: "grid",
    gap: [2, 3],
    gridTemplateColumns: ["auto", "repeat(4, 1fr)"],
    gridTemplateRows: ["repeat(4, 1fr)", "none"],
};

const tableauStyles: ThemeUIStyleObject = {
    display: "grid",
    gap: [2, 3],
    gridTemplateColumns: ["auto", "repeat(7, 1fr)"],
    gridTemplateRows: ["repeat(7, 1fr)", "none"],
};

const PileGroup = forwardRef<HTMLDivElement, GroupProps>(
    (
        {
            piles = [],
            name,
            stackDown,
            onDrop,
            onCardClick,
            onCardDoubleClick,
            onPileClick,
        },
        ref,
    ) => (
        <Box
            ref={ref}
            sx={{
                label: _capitalize(name),
                gridArea: name,
                position: "relative",
                ...(name === PileGroupName.FOUNDATION ? foundationStyles : {}),
                ...(name === PileGroupName.TABLEAU ? tableauStyles : {}),
            }}
        >
            {piles.map((pile) => (
                <Pile
                    name={name}
                    cards={pile.cards}
                    index={pile.index}
                    stackDown={stackDown}
                    onClick={onPileClick}
                    onDrop={onDrop}
                    onCardClick={onCardClick}
                    onCardDoubleClick={onCardDoubleClick}
                    key={pile.index} // eslint-disable-line react/no-array-index-key
                />
            ))}
        </Box>
    ),
);

PileGroup.displayName = "PileGroup";

export default PileGroup;
