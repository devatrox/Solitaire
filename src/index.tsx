import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@theme-ui/theme-provider";

import { createInitialState } from "./setup";
import Loader from "./components/Loader";
import theme from "./theme";

const initialState = createInitialState();

const App: React.FC = () => {
    const Game = lazy(() => import("./Game"));

    const SvgCards = lazy(() => import("./components/SvgCards"));

    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Loader />}>
                <SvgCards />
                <Game initialState={initialState} />
            </Suspense>
        </ThemeProvider>
    );
};

ReactDOM.render(<App />, document.getElementById("app"));
