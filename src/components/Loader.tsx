/* Source https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52/ */

import React, { memo } from "react";
import styled, { keyframes } from "styled-components";

const bulging = keyframes`
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
`;

const Dot = styled.div`
    font-size: 2rem;
    display: inline-block;
    margin: auto 0.25em;
    height: 0.75em;
    width: 0.75em;
    border-radius: 0.375em;
    background: #fff;
    animation: ${bulging} 2s infinite ease-in-out;
`;

const Dot1 = styled(Dot)`
    animation-delay: -0.4s;
`;

const Dot2 = styled(Dot)`
    animation-delay: -0.2s;
`;

const Dot3 = styled(Dot)``;

interface LoaderProps {
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => (
    <div className={className}>
        <Dot1 />
        <Dot2 />
        <Dot3 />
    </div>
);

const StyledLoader = styled(Loader)`
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
`;

export default memo(StyledLoader);
