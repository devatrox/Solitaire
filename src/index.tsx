import React, { lazy, Fragment, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Normalize } from "styled-normalize";
import { GameProps } from "./definitions";
import { createInitialState } from "./setup";
import { GlobalStyle } from "./styles";
import Loader from "./components/Loader";

const App: React.FC<GameProps> = ({ initialState }) => {
    const Game = lazy(() => import("./Game"));

    const SvgCards = lazy(() => import("./components/SvgCards"));

    return (
        <Fragment>
            <Normalize />
            <GlobalStyle />
            <Suspense fallback={<Loader />}>
                <SvgCards />
                <Game initialState={initialState} />
            </Suspense>
        </Fragment>
    );
};

const container = document.getElementById("app")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container);

root.render(<App initialState={createInitialState()} />);
