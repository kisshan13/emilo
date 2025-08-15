import React from "react";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

const CustomButton = React.forwardRef(
  ({ isLoading, children, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={isLoading} {...props}>
        {isLoading ? <Loader2 className="animate-spin" /> : children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";

export default CustomButton;
