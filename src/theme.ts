import { Theme } from "@theme-ui/css";
import preset from "@theme-ui/preset-system";

export const GAP = 20;
export const CARD_WIDTH = "100%";
export const CARD_HEIGHT = "140%";
export const CARD_BORDER_RADIUS = 8;
export const CARD_STACK_MARGIN = "12%";

export const GAP_SMALL = 10;
export const CARD_WIDTH_SMALL = "7vh";
export const CARD_HEIGHT_SMALL = `calc(${CARD_WIDTH_SMALL} / 100 * 140)`;
export const CARD_BORDER_RADIUS_SMALL = "20%";
export const CARD_STACK_MARGIN_SMALL = 5;

const theme: Theme = {
    ...preset,
    colors: {
        green: "#3d9970",
        red: "#bd0534",
        blue: "#7d99d5",
        black: "#111",
        gray: "#aaa",
        orange: "#ff851b",
        text: "#fff",
        background: "#3d9970",
        primary: "#3d9970",
        borderColor: "#000",
    },
    styles: {
        ...preset.styles,
        root: {
            ...preset.styles.root,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            backgroundImage: "radial-gradient(transparent, rgba(0, 0, 0, 0.4))",
        },
        a: {
            color: "inherit",
            "&:hover": {
                textDecoration: "none",
            },
        },
    },
};

export default theme;
