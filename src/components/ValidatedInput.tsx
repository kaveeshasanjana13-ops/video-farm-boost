import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { forwardRef } from "react";

// Block Sinhala characters - allow only English letters, numbers, and symbols
const blockSinhalaInput = (e: React.KeyboardEvent) => {
  const char = e.key;
  // Sinhala Unicode range: U+0D80 to U+0DFF
  if (char.length === 1 && char.charCodeAt(0) >= 0x0D80 && char.charCodeAt(0) <= 0x0DFF) {
    e.preventDefault();
    toast.error("Only English letters, numbers, and symbols are allowed");
  }
};

// Validated Input wrapper
export const ValidatedInput = forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof Input>
>((props, ref) => {
  return (
    <Input
      {...props}
      ref={ref}
      onKeyDown={(e) => {
        blockSinhalaInput(e);
        props.onKeyDown?.(e);
      }}
    />
  );
});

ValidatedInput.displayName = "ValidatedInput";

// Validated Textarea wrapper
export const ValidatedTextarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<typeof Textarea>
>((props, ref) => {
  return (
    <Textarea
      {...props}
      ref={ref}
      onKeyDown={(e) => {
        blockSinhalaInput(e);
        props.onKeyDown?.(e);
      }}
    />
  );
});

ValidatedTextarea.displayName = "ValidatedTextarea";
