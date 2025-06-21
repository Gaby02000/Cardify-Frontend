import type { LabelHTMLAttributes } from "react"

export const Label = ({ children, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => {
  return <label {...props}>{children}</label>
}
