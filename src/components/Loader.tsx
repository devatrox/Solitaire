/* Source https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52/ */

import { useSprings, animated } from "@react-spring/web";
import { Box, BoxProps, Flex, ThemeUIStyleObject } from "theme-ui";

const Dot = animated(Box);

const dotStyles: ThemeUIStyleObject = {
    fontSize: "2rem",
    display: "inline-block",
    marginY: "auto",
    marginX: "0.25em",
    height: "0.75em",
    width: "0.75em",
    borderRadius: "0.375em",
    background: "white",
};

const dotDelays = [40, 20, 0];

const Loader: React.FC<BoxProps> = ({ sx, ...boxProps }) => {
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

    const dotSprings = useSprings(
        3,
        dotDelays.map((delay) => ({
            ...springConfig,
            delay,
        })),
    );

    return (
        <Flex
            sx={{
                width: "100%",
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
                ...sx,
            }}
            {...boxProps}
        >
            {dotSprings.map((style, i) => (
                <Dot sx={dotStyles} style={style} key={i} />
            ))}
        </Flex>
    );
};

export default Loader;
