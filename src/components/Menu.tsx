/** @jsx jsx */

import { memo } from "react";
import { jsx, css } from "@emotion/react";
import _noop from "lodash/noop";
import { btnStyles as globalBtnStyles } from "../styles";
import { MenuProps } from "../definitions";

const Menu: React.FC<MenuProps> = ({
    message,
    isDone,
    isFinished,
    onFinish = _noop,
    onReset = _noop,
}) => {
    const textColor = "255, 255, 255";

    const styles = css`
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: var(--grid-gap);
        display: grid;
        grid-gap: var(--grid-gap);
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto;
        grid-template-areas: "menuLeft menuCenter menuRight";
        color: rgba(${textColor}, 0.7);

        @media (max-width: 768px) {
            grid-template-columns: auto;
            grid-template-areas: "menuCenter menuCenter" "menuLeft menuRight";
        }
    `;

    const menuElementStyles = css`
        label: MenuElement;
        display: flex;

        > * + * {
            margin-left: var(--grid-gap);
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
        padding: 0.375rem 0;
        border: 2px solid transparent;
    `;

    return (
        <div css={styles}>
            <div
                css={css`
                    ${menuElementStyles} grid-area: menuLeft;
                `}
            >
                <button css={btnStyles} type="button" onClick={onReset}>
                    New Game
                </button>
                <button
                    css={btnStyles}
                    type="button"
                    disabled={!isDone && !isFinished}
                    onClick={onFinish}
                >
                    Finish
                </button>
            </div>
            <div
                css={css`
                    ${textStyles} grid-area: menuCenter;
                `}
            >
                {message}
            </div>
            <div
                css={css`
                    ${menuElementStyles} grid-area: menuRight;
                `}
            >
                <a css={btnStyles} href="https://github.com/devatrox/Solitaire">
                    GitHub
                </a>
            </div>
        </div>
    );
};

export default memo(Menu);
