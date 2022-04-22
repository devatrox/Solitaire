import { forwardRef } from "react";
import { Button as BaseButton, ButtonProps as BaseButtonProps } from "theme-ui";

const Button = forwardRef<HTMLButtonElement, BaseButtonProps>(
    ({ sx, ...props }, ref) => (
        <BaseButton
            ref={ref}
            sx={{
                display: "inline-block",
                textAlign: "center",
                verticalAlign: "middle",
                userSelect: "none",
                backgroundColor: "transparent",
                paddingX: "0.75rem",
                paddingY: "0.375rem",
                fontSize: "1rem",
                lineHeight: "1.5",
                borderRadius: "0.25rem",
                textDecoration: "none",
                textTransform: "none",
                color: "inherit",
                border: "2px solid currentColor",
                fontWeight: "bold",

                "&:hover, &:focus": {
                    color: "#fff",
                },

                "&[disabled]": {
                    color: "rgba(255, 255, 255, 0.3)",
                },

                "&:not([disabled])": {
                    cursor: "pointer",
                },
                ...sx,
            }}
            {...props}
        />
    ),
);

Button.displayName = "Button";

export default Button;
