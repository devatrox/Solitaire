/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import Pile from './Pile';
import { GroupProps, PileName } from '../definitions';

const PileGroup = (props: GroupProps): JSX.Element => {
    const {
        piles = [],
        name,
        stackDown,
        onDrop,
        onCardClick,
        onCardDoubleClick,
        onPileClick
    } = props;

    const styles = css`
        grid-area: ${name};
        position: relative;
        ${name === PileName.FOUNDATION && `
            display: grid;
            grid-gap: var(--grid-gap);
            grid-template-columns: repeat(4, 1fr);

            @media (max-width: 768px) {

            }
        `}
        ${name === PileName.TABLEAU && `
            display: grid;
            grid-gap: var(--grid-gap);
            grid-template-columns: repeat(7, 1fr);

            @media (max-width: 768px) {

            }
        `}
    `;

    return (
        <div css={styles}>
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
        </div>
    );
};

export default PileGroup;
