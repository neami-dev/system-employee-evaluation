import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        className,"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground ffocus-visible:outline-none ffocus-visible:ring-2 ffocus-visible:ring-ring ffocus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
