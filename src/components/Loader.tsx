/* Source https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52/ */

import { useSpring, animated } from "@react-spring/web";
import { Box, Flex, FlexProps } from "@theme-ui/components";
import React from "react";

const AnimatedBox = animated(Box);

const dotStyles = {
    fontSize: "2rem",
    display: "inline-block",
    margin: "auto 0.25em",
    height: "0.75em",
    width: "0.75em",
    borderRadius: "0.375em",
    background: "white",
};

const Loader: React.FC<FlexProps> = ({ sx, ...flexProps }) => {
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
        <Flex
            sx={{
                width: "100%",
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
                ...sx,
            }}
            {...flexProps}
        >
            <AnimatedBox sx={dotStyles} style={dot1Styles} />
            <AnimatedBox sx={dotStyles} style={dot2Styles} />
            <AnimatedBox sx={dotStyles} style={dot3Styles} />
        </Flex>
    );
};

export default Loader;
