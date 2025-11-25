import * as React from "react"
import { cn } from "@/lib/utils"

interface PhoneInputProps extends Omit<React.ComponentProps<"input">, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(value || "+94");

    React.useEffect(() => {
      if (!value || value === "") {
        setLocalValue("+94");
        onChange("+94");
      } else if (!value.startsWith("+94")) {
        setLocalValue("+94" + value);
        onChange("+94" + value);
      } else {
        setLocalValue(value);
      }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      // Ensure it always starts with +94
      if (!newValue.startsWith("+94")) {
        newValue = "+94";
      }
      
      // Get the part after +94
      const afterPrefix = newValue.substring(3);
      
      // Don't allow 0 as the first digit after +94
      if (afterPrefix.length > 0 && afterPrefix[0] === "0") {
        return; // Block the input
      }
      
      // Only allow digits after +94
      if (afterPrefix && !/^\d*$/.test(afterPrefix)) {
        return; // Block non-numeric input
      }
      
      setLocalValue(newValue);
      onChange(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      const cursorPosition = target.selectionStart || 0;
      
      // Prevent deleting/modifying the +94 prefix
      if ((e.key === "Backspace" || e.key === "Delete") && cursorPosition <= 3) {
        e.preventDefault();
      }
      
      // Prevent moving cursor before +94
      if ((e.key === "ArrowLeft" || e.key === "Home") && cursorPosition <= 3) {
        e.preventDefault();
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      const cursorPosition = target.selectionStart || 0;
      
      // Move cursor after +94 if clicked before it
      if (cursorPosition < 3) {
        target.setSelectionRange(3, 3);
      }
    };

    return (
      <input
        type="tel"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput }
