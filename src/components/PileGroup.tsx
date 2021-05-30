import React from "react";
import styled from "styled-components";
import Pile from "./Pile";
import { GroupProps, PileName } from "../definitions";

interface StyledContainerProps {
    name: string;
}

const StyledContainer = styled.div<StyledContainerProps>`
    grid-area: ${(props) => props.name};
    position: relative;
    ${(props) =>
        props.name === PileName.FOUNDATION &&
        `
    display: grid;
    grid-gap: var(--grid-gap);
    grid-template-columns: repeat(4, 1fr);

    @media (max-width: 768px) {
        grid-template-columns: auto;
        grid-template-rows: repeat(4, 1fr);
    }
    `}
    ${(props) =>
        props.name === PileName.TABLEAU &&
        `
    display: grid;
    grid-gap: var(--grid-gap);
    grid-template-columns: repeat(7, 1fr);

    @media (max-width: 768px) {
        grid-template-columns: auto;
        grid-template-rows: repeat(7, 1fr);
    }
    `}
`;

const PileGroup: React.FC<GroupProps> = ({
    piles = [],
    name,
    stackDown,
    onDrop,
    onCardClick,
    onCardDoubleClick,
    onPileClick,
}) => (
    <StyledContainer name={name}>
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
    </StyledContainer>
);

export default PileGroup;
