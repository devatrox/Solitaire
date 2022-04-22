import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "theme-ui";
import { Global } from "@emotion/react";

import { GameState } from "./types";
import { createInitialState } from "./setup";
import Loader from "./components/Loader";
import { theme } from "./theme";

export interface AppProps {
    initialState: GameState;
}

const App: React.FC<AppProps> = ({ initialState }) => {
    const Game = lazy(() => import("./Game"));
    const SvgCards = lazy(() => import("./components/SvgCards"));

    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Loader />}>
                <Global
                    styles={(theme) => ({
                        body: {
                            position: "fixed",
                            overflow: "hidden",
                            width: "100%",
                            backgroundImage:
                                "radial-gradient(transparent, rgba(0, 0, 0, 0.4))",
                        },
                    })}
                />
                <SvgCards />
                <Game initialState={initialState} />
            </Suspense>
        </ThemeProvider>
    );
};

const container = document.getElementById("app")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container);

root.render(<App initialState={createInitialState()} />);
