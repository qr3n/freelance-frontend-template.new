import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/shadcn/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white hover:bg-black/95",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-zinc-200 bg-transparent text-black hover:bg-zinc-100",
        secondary:
          "bg-zinc-600 text-white hover:bg-zinc-700",
        ghost: "hover:bg-black/10 text-black hover:text-black",
        link: "text-black underline-offset-4 hover:underline",
      },
      size: {
        default: "rounded-full h-9 px-4 py-2",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-10 rounded-full px-8",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Определяем цвет скелетона в зависимости от варианта кнопки
    const getSkeletonVariant = () => {
      switch (variant) {
        case 'default':
        case 'destructive':
        case 'secondary':
          return 'light' as const
        case 'outline':
        case 'ghost':
        case 'link':
        default:
          return 'light' as const
      }
    }

    return (
      <>
        <style>{`
          @keyframes skeleton-wave {
            0% {
              transform: translateX(-100%) rotate(10deg);
            }
            100% {
              transform: translateX(200%) rotate(10deg);
            }
          }

          .button-skeleton-wave {
            position: relative;
            overflow: hidden;
          }

          .button-skeleton-wave::after {
            content: '';
            position: absolute;
            top: -50%;
            left: 0;
            width: 50%;
            height: 200%;
            animation: skeleton-wave 0.7s infinite ease-in-out;
            transform-origin: center;
          }

          .button-skeleton-light::after {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.15),
              transparent
            );
          }

          .button-skeleton-dark::after {
            background: linear-gradient(
              90deg,
              transparent, 
              rgba(255, 255, 255, 0.03),
              transparent
            );
          }
        `}</style>
        <Comp
          className={cn(
            buttonVariants({ variant, size, className }),
            isLoading && "button-skeleton-wave",
            isLoading && `button-skeleton-${getSkeletonVariant()}`
          )}
          ref={ref}
          disabled={isLoading || props.disabled}
          {...props}
        >
          {props.children}
        </Comp>
      </>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }