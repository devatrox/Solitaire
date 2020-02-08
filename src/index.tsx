/** @jsx jsx */

import { lazy, Fragment, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Global, jsx } from '@emotion/core';
import {
    GameProps
} from './definitions';
import { createInitialState } from './setup';
import { globalStyles } from './styles';
import Loader from './components/Loader';

const App = (props: GameProps): JSX.Element => {
    const {
        initialState
    } = props;

    const Game = lazy(() => import('./Game'));

    const SvgCards = lazy(() => import('./components/SvgCards'));

    return (
        <Fragment>
            <Global styles={globalStyles} />
            <Suspense fallback={<Loader />}>
                <SvgCards />
                <Game initialState={initialState} />
            </Suspense>
        </Fragment>
    );
};

ReactDOM.render(<App initialState={createInitialState()} />, document.getElementById('app'));
