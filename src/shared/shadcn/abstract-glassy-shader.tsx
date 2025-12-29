import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from '@/shared/shadcn/lib/utils';

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  dotColor?: string;
  dotHoverColor?: string;
  dotSize?: string;
  duration?: number;
  textColor?: string;
  textHoverColor?: string;
  size?: "default" | "small";
  dotInitialPosition?: { left?: string; top?: string };
  textTranslate?: string;
  hoverTranslate?: string;
  arrowSize?: string;
}

const InteractiveHoverButton = React.forwardRef<
HTMLButtonElement,
InteractiveHoverButtonProps
>(({
     text = "О НАС",
     className,
     dotColor = "#ffffff",
     dotHoverColor = "#46cd48",
     dotSize = "h-2 w-2",
     duration = 300,
     textColor = "#ffffff",
     textHoverColor = "#ffffff",
     size = "default",
     dotInitialPosition,
     textTranslate = "translate-x-2 group-hover:translate-x-12",
     hoverTranslate = "translate-x-12 group-hover:-translate-x-1",
     arrowSize,
     ...props
   }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const sizeClasses = size === "small"
    ? "w-[100px] px-1.5 py-2 text-base"
    : "w-[150px] px-2 py-4 text-xl";

  const defaultArrowSize = size === "small" ? "h-4 w-4" : "";

  return (
    <button
      ref={ref}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-full bg-black text-center font-semibold",
        sizeClasses,
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <span
        className={cn(
          "inline-block transition-all group-hover:opacity-0",
          textTranslate
        )}
        style={{
          transitionDuration: `${duration}ms`,
          color: textColor,
        }}
      >
        {text}
      </span>
      <div
        className={cn(
          "absolute top-0 z-10 flex h-full w-full items-center justify-center gap-2 opacity-0 transition-all group-hover:opacity-100",
          hoverTranslate
        )}
        style={{
          transitionDuration: `${duration}ms`,
          color: textHoverColor,
        }}
      >
        <span>{text}</span>
        <ArrowRight className={cn(arrowSize || defaultArrowSize)} />
      </div>
      <div
        className={cn(
          "absolute left-[20%] top-[43%] scale-[1] rounded-2xl transition-all group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8]",
          dotSize,
        )}
        style={{
          ...(dotInitialPosition?.left && { left: dotInitialPosition.left }),
          ...(dotInitialPosition?.top && { top: dotInitialPosition.top }),
          backgroundColor: isHovered ? dotHoverColor : dotColor,
          transitionDuration: `${duration}ms`,
        }}
      ></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };