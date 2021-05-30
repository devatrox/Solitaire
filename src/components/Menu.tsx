import React from "react";
import styled from "styled-components";
import { Button } from "../styles";
import { MenuProps } from "../definitions";

interface ElementProps {
    gridArea: "menuLeft" | "menuCenter" | "menuRight";
}

const MenuElement = styled.div<ElementProps>`
    display: flex;

    > * + * {
        margin-left: var(--grid-gap);
    }
`;

const TextElement = styled.div<ElementProps>`
    font-size: 1rem;
    line-height: 1.5;
    padding: 0.375rem 0;
    border: 2px solid transparent;
`;

const Menu: React.FC<MenuProps> = ({
    className,
    message,
    isDone,
    isFinished,
    onFinish,
    onReset,
}) => (
    <div className={className}>
        <MenuElement gridArea="menuLeft">
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
        <TextElement gridArea="menuCenter">{message}</TextElement>
        <MenuElement gridArea="menuRight">
            <Button as="a" href="https://github.com/devatrox/Solitaire">
                GitHub
            </Button>
        </MenuElement>
    </div>
);

const StyledMenu = styled(Menu)`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--grid-gap);
    display: grid;
    grid-gap: var(--grid-gap);
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
    grid-template-areas: "menuLeft menuCenter menuRight";
    color: rgba(255, 255, 255, 0.7);

    @media (max-width: 768px) {
        grid-template-columns: auto;
        grid-template-areas: "menuCenter menuCenter" "menuLeft menuRight";
    }
`;

export default StyledMenu;
