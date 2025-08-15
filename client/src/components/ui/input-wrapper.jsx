import React from "react";
import { Label } from "./label";

export default function InputWrapper({ children, error, label }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && (
        <div>
          <span className="text-sm text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
}
