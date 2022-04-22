import type { Theme } from "theme-ui";

export const theme: Theme = {
    fonts: {
        body: "system-ui, sans-serif",
        heading: "system-ui, sans-serif",
        monospace: "system-ui, sans-serif",
    },
    fontWeights: {
        body: 400,
        heading: 700,
        bold: 700,
    },
    lineHeights: {
        body: 1.5,
        heading: 1.125,
    },
    colors: {
        green: "#3d9970",
        red: "#bd0534",
        blue: "#7d99d5",
        orange: "#ff851b",
        black: "#111",
        gray: "#aaa",
        text: "#000",
        background: "#3d9970",
        primary: "#33e",
        cardBorder: "#000",
    },
    breakpoints: [768].map((n) => n + "px"),
    styles: {
        root: {
            fontFamily: "body",
            fontWeight: "body",
            position: "fixed",
            overflow: "hidden",
        },
        a: {
            color: "inherit",
            "&:hover": {
                textDecoration: "none",
            },
        },
    },
};
