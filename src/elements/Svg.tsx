/** @jsxImportSource theme-ui */
import { forwardRef } from "react";
import { SxProp } from "theme-ui";

type SvgProps = React.SVGProps<SVGSVGElement> & SxProp;

const Svg = forwardRef<SVGSVGElement, SvgProps>(({ sx, ...svgProps }, ref) => (
    <svg
        ref={ref}
        viewBox="0 0 169.075 244.64"
        sx={{
            zIndex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            pointerEvents: "none",
            borderRadius: "8px",
            backfaceVisibility: "hidden",
            ...sx,
        }}
        {...svgProps}
    />
));

Svg.displayName = "Svg";

export default Svg;
