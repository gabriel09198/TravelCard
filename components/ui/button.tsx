import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-red-400/35 bg-gradient-to-b from-red-500 to-red-700 text-primary-foreground shadow-lg shadow-red-950/30 hover:-translate-y-0.5 hover:from-red-400 hover:to-red-600 hover:shadow-red-900/35",
        secondary:
          "border border-amber-400/35 bg-gradient-to-b from-amber-500/95 to-amber-700/90 text-slate-950 shadow-lg shadow-amber-950/20 hover:-translate-y-0.5 hover:from-amber-400 hover:to-amber-600",
        outline:
          "border border-amber-500/35 bg-background/70 text-foreground shadow-sm shadow-black/20 hover:-translate-y-0.5 hover:border-amber-300/70 hover:bg-secondary/80",
        ghost:
          "text-foreground hover:bg-amber-500/10 hover:text-amber-100"
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        icon: "h-10 w-10 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, children, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;

    return React.cloneElement(child, {
      className: cn(classes, child.props.className)
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
