import { css } from '@emotion/core';
import emotionNormalize from 'emotion-normalize';

const global = css`
    ${emotionNormalize}
    :root {
        --grid-gap: 20px;
        --card-width: 100%;
        --card-height: 140%;
        --card-border-radius: 5%;
        --card-stack-margin: 12%;
        --color-green: #3d9970;
        --color-red: #bd0534;
        --color-blue: #7d99d5;
        --color-black: #111;
        --color-gray: #aaa;

        @media (max-width: 768px) {
            --grid-gap: 10px;
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    text-decoration: none;
    text-transform: none;

    &:not([disabled]) {
        cursor: pointer;
    }
`;

export {
    global as globalStyles,
    btn as btnStyles
};
