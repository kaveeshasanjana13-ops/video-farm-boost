import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

// Success/info toasts: bottom-right with green styling
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-green-500 group-[.toaster]:text-white group-[.toaster]:border-green-600 group-[.toaster]:shadow-lg group-[.toaster]:text-xs group-[.toaster]:py-2 group-[.toaster]:px-3",
          success:
            "group-[.toaster]:!bg-green-500 group-[.toaster]:!text-white group-[.toaster]:!border-green-600",
          error:
            "group-[.toaster]:!bg-destructive group-[.toaster]:!text-white group-[.toaster]:!border-destructive",
          description: "group-[.toast]:text-white/90 group-[.toast]:text-[11px]",
          actionButton:
            "group-[.toast]:bg-white group-[.toast]:text-green-600",
          cancelButton:
            "group-[.toast]:bg-white/20 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  )
}

// Error toasts: bottom-right
const ErrorToaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group error-toaster"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive group-[.toaster]:shadow-lg group-[.toaster]:text-xs group-[.toaster]:py-2 group-[.toaster]:px-3",
          description: "group-[.toast]:text-destructive-foreground/90 group-[.toast]:text-[11px]",
          actionButton:
            "group-[.toast]:bg-background group-[.toast]:text-foreground",
          cancelButton:
            "group-[.toast]:bg-background/20 group-[.toaster]:text-destructive-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, ErrorToaster, toast }
