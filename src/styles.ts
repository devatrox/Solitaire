import { css } from "@emotion/react";
import emotionNormalize from "emotion-normalize";

const global = css`
    ${emotionNormalize}
    :root {
        --grid-gap: 20px;
        --card-width: 100%;
        --card-height: 140%;
        --card-border-radius: 8px;
        --card-stack-margin: 12%;
        --color-green: #3d9970;
        --color-red: #bd0534;
        --color-blue: #7d99d5;
        --color-black: #111;
        --color-gray: #aaa;
        --color-orange: #ff851b;
        --card-border-color: #000;

        @media (max-width: 768px) {
            --grid-gap: 10px;
            --card-width: 7vh;
            --card-height: calc(var(--card-width) / 100 * 140);
            --card-stack-margin: 20%;
            --card-border-radius: 5px;
        }
    }

    *,
    *:before,
    *:after {
        box-sizing: inherit;
    }

    html {
        box-sizing: border-box;
    }

    html,
    body {
        position: fixed;
        overflow: hidden;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        background-color: var(--color-green);
        background-image: radial-gradient(transparent, rgba(0, 0, 0, 0.4));
        width: 100%;
    }

    a {
        color: inherit;

        &:hover {
            text-decoration: none;
        }
    }
`;

const btn = css`
    display: inline-block;
    font-weight: 400;
    color: var(--color-black);
    text-align: center;
    vertical-align: middle;
    user-select: none;
    background-color: transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    text-decoration: none;
    text-transform: none;

    &:not([disabled]) {
        cursor: pointer;
    }
`;

export { global as globalStyles, btn as btnStyles };
