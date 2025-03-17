import * as React from "react"

import { cn } from "~/lib/utils"

function TextArea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
        data-slot="textarea"
        className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "flex w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none",
        "h-28",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
        )}
        {...props}
    />
  )
}

export { TextArea }