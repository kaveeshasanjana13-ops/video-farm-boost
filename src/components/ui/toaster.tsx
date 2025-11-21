import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  const attendanceToasts = toasts.filter(t => t.isAttendanceAlert)
  const regularToasts = toasts.filter(t => !t.isAttendanceAlert)

  return (
    <>
      {/* Attendance Alerts - Top Left with Images */}
      <ToastProvider>
        {attendanceToasts.map(function ({ id, title, description, action, imageUrl, status, ...props }) {
          const variant = status === 'present' ? 'success' : status === 'absent' ? 'absent' : status === 'late' ? 'late' : 'default'
          return (
            <Toast key={id} {...props} variant={variant}>
              <div className="flex items-center gap-3">
                {imageUrl && (
                  <img 
                    src={imageUrl} 
                    alt="Student" 
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                <div className="grid gap-1 flex-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport className="top-0 left-0 flex-col p-4 md:max-w-[420px]" />
      </ToastProvider>

      {/* Regular Toasts - Bottom Right */}
      <ToastProvider>
        {regularToasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })}
        <ToastViewport className="bottom-0 right-0 flex-col-reverse p-4 md:max-w-[420px]" />
      </ToastProvider>
    </>
  )
}
