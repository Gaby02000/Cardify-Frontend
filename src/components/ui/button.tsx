import type { ButtonHTMLAttributes } from "react"
import clsx from "clsx"

export const Button = ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => {
  return (
    <button
      {...props}
      className={clsx("px-4 py-2 rounded font-medium", className)}
    />
  )
}
