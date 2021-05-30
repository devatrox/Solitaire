import React, { lazy, Fragment, Suspense } from "react";
import ReactDOM from "react-dom";
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

ReactDOM.render(
    <App initialState={createInitialState()} />,
    document.getElementById("app"),
);
