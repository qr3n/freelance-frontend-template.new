"use client";

import { cn } from "@/shared/shadcn/lib/utils";
import { Button, ButtonProps } from "@/shared/shadcn/ui/button";

export default function LargeButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn("text-lg sm:text-2xl md:text-3xl lg:text-4xl py-4 sm:py-6 md:py-8 lg:py-[36px] px-6 sm:px-8 md:px-10 lg:px-[52px]", props.className)}
    />
  );
}