/* Source https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52/ */

import { useSpring, animated } from "@react-spring/web";
import React from "react";
import styled from "styled-components";

const Dot = styled(animated.div)`
    font-size: 2rem;
    display: inline-block;
    margin: auto 0.25em;
    height: 0.75em;
    width: 0.75em;
    border-radius: 0.375em;
    background: #fff;
`;

interface LoaderProps {
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
    const springConfig = {
        loop: { reverse: true },
        from: {
            transform: "scale(0)",
            opacity: 0.5,
        },
        to: {
            transform: "scale(1)",
            opacity: 1,
        },
    };

    const dot1Styles = useSpring({
        ...springConfig,
        delay: 40,
    });

    const dot2Styles = useSpring({
        ...springConfig,
        delay: 20,
    });

    const dot3Styles = useSpring({
        ...springConfig,
    });

    return (
        <div className={className}>
            <Dot style={dot1Styles} />
            <Dot style={dot2Styles} />
            <Dot style={dot3Styles} />
        </div>
    );
};

const StyledLoader = styled(Loader)`
    display: flex;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
`;

export default StyledLoader;
