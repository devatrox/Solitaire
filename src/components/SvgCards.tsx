/** @jsxImportSource theme-ui */
import { forwardRef } from "react";
import { SxProp } from "theme-ui";
import SvgCardsRaw from "../svg-cards.svg";

type SvgProps = React.SVGProps<SVGSVGElement> & SxProp;

const SvgCards = forwardRef<SVGSVGElement, SvgProps>(
    ({ sx, ...props }, ref) => (
        <SvgCardsRaw ref={ref} sx={{ display: "none", ...sx }} {...props} />
    ),
);

SvgCards.displayName = "SvgCards";

export default SvgCards;
