import type { InputHTMLAttributes } from "react"
import clsx from "clsx"

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={clsx("w-full px-3 py-2 rounded border bg-white/10 text-white", className)}
    />
  )
}
