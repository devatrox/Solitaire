import { Box, Flex, Grid, GridProps } from "theme-ui";

import Button from "../elements/Button";
import { MenuEvent } from "../types";

export interface MenuProps extends GridProps {
    message: string;
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
            label: "MenuContainer",
            gap: [2, 3],
            gridTemplateColumns: ["auto", "auto 1fr auto"],
            gridTemplateRows: "auto",
            gridTemplateAreas: [
                '"menuCenter menuCenter" "menuLeft menuRight"',
                '"menuLeft menuCenter menuRight"',
            ],
            color: "rgba(255, 255, 255, 0.7)",
        }}
    >
        <Flex sx={{ label: "MenuLeft", gridArea: "menuLeft", gap: 2 }}>
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
        </Flex>
        <Box
            sx={{
                label: "MenuCenter",
                gridArea: "menuCenter",
                fontSize: "1rem",
                lineHeight: "1.5",
                paddingY: "0.375rem",
                paddingX: 0,
                border: "2px solid transparent",
            }}
        >
            {message}
        </Box>
        <Flex sx={{ label: "MenuRight", gridArea: "menuRight" }}>
            <Button as="a" href="https://github.com/devatrox/Solitaire">
                GitHub
            </Button>
        </Flex>
    </Grid>
);

export default Menu;
