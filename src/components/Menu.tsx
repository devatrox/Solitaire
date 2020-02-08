/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import _noop from 'lodash/noop';
import { btnStyles as globalBtnStyles } from '../styles';
import { MenuProps } from '../definitions';

const Menu = (props: MenuProps): JSX.Element => {
    const {
        message,
        isDone,
        isFinished,
        onFinish = _noop,
        onReset = _noop
    } = props;

    const textColor = '255, 255, 255';

    const styles = css`
        grid-area: menu;
        display: grid;
        grid-gap: var(--grid-gap);
        grid-template-columns: repeat(2, auto) 1fr repeat(2, auto);
        color: rgba(${textColor}, 0.7);

        @media (max-width: 768px) {
            grid-gap: calc(var(--grid-gap) / 2);
        }
    `;

    const btnStyles = css`
        label: MenuBtn;
        ${globalBtnStyles}
        color: inherit;
        border: 2px solid currentColor;
        font-weight: bold;

        &:hover,
        &:focus {
            color: #fff;
        }

        &[disabled] {
            color: rgba(${textColor}, 0.3);
        }
    `;

    const textStyles = css`
        font-size: 1rem;
        line-height: 1.5;
        padding: .375rem .75rem;
        border: 2px solid transparent;
    `;

    return (
        <div css={styles}>
            <button css={btnStyles} type="button" onClick={onReset}>New Game</button>
            <button css={btnStyles} type="button" disabled={!isDone && !isFinished} onClick={onFinish}>Finish</button>
            <div css={textStyles}>{message}</div>
            <div css={textStyles}>
                <a href="https://github.com/htdebeer/SVG-cards">SVG Cards by htdebeer</a>
            </div>
            <a css={btnStyles} href="https://github.com/devatrox/Solitaire">GitHub</a>
        </div>
    );
};

export default Menu;
