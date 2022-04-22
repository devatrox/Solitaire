import { Box, ThemeUIStyleObject } from "theme-ui";

import Pile from "./Pile";
import { GenericPileProps, PileClickEvent, PileName } from "../types";
import Card from "../Card";

export interface GroupProps extends GenericPileProps {
    piles: Card[][];
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
            label: name,
            gridArea: name,
            position: "relative",
            ...(name === PileName.FOUNDATION ? foundationStyles : {}),
            ...(name === PileName.TABLEAU ? tableauStyles : {}),
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
