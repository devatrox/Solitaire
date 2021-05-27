/** @jsx jsx */

import { jsx, css } from "@emotion/react";
import SvgCards from "svg-cards/svg-cards.svg";

const Svg: React.FC = () => (
    <SvgCards
        css={css`
            display: none;
        `}
    />
);

export default Svg;
