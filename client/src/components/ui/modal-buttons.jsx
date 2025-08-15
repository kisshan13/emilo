import CustomButton from "./custom-button";
import { Button } from "./button";

export function ModalButtons({
  backText,
  isLoading,
  nextText,
  onBackClick,
  onNextClick,
  disableAll
}) {
  return (
    <div className="flex items-center justify-end gap-5">
      <Button
        variant="outline"
        disabled={isLoading}
        onClick={(e) => {
          e.preventDefault();
          if (onBackClick) {
            onBackClick();
          }
        }}
      >
        {backText || "Back"}
      </Button>
      <CustomButton
        onClick={() => {
          if (onNextClick) {
            onNextClick();
          }
        }}
        disabled={disableAll}
        isLoading={isLoading}
      >
        {nextText || "Next"}
      </CustomButton>
    </div>
  );
}
