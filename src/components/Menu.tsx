import {
    Button as BaseButton,
    ButtonProps,
    Flex,
    FlexProps,
    Grid,
    Text,
} from "@theme-ui/components";
import React from "react";
import { GAP } from "../theme";
import { MenuEvent } from "../definitions";

const Button: React.FC<ButtonProps> = ({ sx, ...flexProps }) => (
    <BaseButton
        sx={{
            display: "inline-block",
            textAlign: "center",
            verticalAlign: "middle",
            userSelect: "none",
            backgroundColor: "transparent",
            paddingY: "0.375rem",
            paddingX: "0.75rem",
            fontSize: "1rem",
            borderRadius: "0.25rem",
            textDecoration: "none",
            textTransform: "none",
            color: "inherit",
            border: "2px solid currentColor",
            fontWeight: "bold",

            ":hover, :focus": {
                color: "white",
            },

            ":disabled": {
                color: "rgba(255, 255, 255, 0.3)",
            },

            ":not(:disabled)": {
                cursor: "pointer",
            },
            ...sx,
        }}
        {...flexProps}
    />
);

const MenuElement: React.FC<FlexProps> = ({ sx, ...flexProps }) => (
    <Flex
        sx={{
            gap: GAP,
            ...sx,
        }}
        {...flexProps}
    />
);

export interface MenuProps {
    message?: string;
    isDone: boolean;
    isFinished: boolean;
    onFinish?: MenuEvent;
    onReset?: MenuEvent;
}

const Menu: React.FC<MenuProps> = ({
    message,
    isDone,
    isFinished,
    onFinish,
    onReset,
}) => (
    <Grid
        sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: GAP,
            gridGap: GAP,
            gridTemplateColumns: "auto 1fr auto",
            gridTemplateRows: "auto",
            gridTemplateAreas: '"menuLeft menuCenter menuRight"',
            color: "rgba(255, 255, 255, 0.7)",

            "@media (max-width: 768px)": {
                gridTemplateColumns: "auto",
                gridTemplateAreas:
                    '"menuCenter menuCenter" "menuLeft menuRight"',
            },
        }}
    >
        <MenuElement sx={{ gridArea: "menuLeft" }}>
            <Button type="button" onClick={onReset}>
                New Game
            </Button>
            <Button
                type="button"
                disabled={!isDone && !isFinished}
                onClick={onFinish}
            >
                Finish
            </Button>
        </MenuElement>
        <Text
            as="div"
            sx={{
                paddingY: "0.375rem",
                border: "2px solid transparent",
                gridArea: "menuCenter",
            }}
        >
            {message}
        </Text>
        <MenuElement sx={{ gridArea: "menuRight" }}>
            <Button as="a" href="https://github.com/devatrox/Solitaire">
                GitHub
            </Button>
        </MenuElement>
    </Grid>
);

export default Menu;
