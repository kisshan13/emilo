import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

export default function Modal({
  isOpen,
  title,
  children,
  className,
  hideTitle,
  onOpenChange,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {!hideTitle && <>{title || "Are you absolutely sure?"}</>}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div>{children}</div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
