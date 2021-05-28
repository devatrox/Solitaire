/** @jsx jsx */
/* Source https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52/ */

import { memo, useMemo } from "react";
import { jsx, css, keyframes } from "@emotion/react";

const Loader: React.FC = () => {
    const bulging = useMemo(
        () => keyframes`
        0%,
        80%,
        100% {
            transform: scale(0);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    `,
        [],
    );

    const style = useMemo(
        () => css`
            display: flex;
            width: 100%;
            height: 100vh;
            justify-content: center;
            align-items: center;
        `,
        [],
    );

    const ballStyle = useMemo(
        () => css`
            font-size: 2rem;
            display: inline-block;
            margin: auto 0.25em;
            height: 0.75em;
            width: 0.75em;
            border-radius: 0.375em;
            background: #fff;
            animation: ${bulging} 2s infinite ease-in-out;
        `,
        [bulging],
    );

    const ball1Style = useMemo(
        () => css`
            ${ballStyle}
            animation-delay: -0.4s;
        `,
        [ballStyle],
    );

    const ball2Style = useMemo(
        () => css`
            ${ballStyle}
            animation-delay: -0.2s;
        `,
        [ballStyle],
    );

    const ball3Style = useMemo(
        () => css`
            ${ballStyle}
        `,
        [ballStyle],
    );

    return (
        <div css={style}>
            <span css={ball1Style} />
            <span css={ball2Style} />
            <span css={ball3Style} />
        </div>
    );
};

export default memo(Loader);
