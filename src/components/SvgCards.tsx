/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import SvgCards from 'svg-cards/svg-cards.svg';

const Svg = (): JSX.Element => (<SvgCards id="svg-cards" css={css`display: none;`} />);

export default Svg;
