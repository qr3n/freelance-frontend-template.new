import { PropsWithChildren } from "react";
import { cn } from "@/shared/shadcn/lib/utils";
import { TailwindBgColor } from "@/shared/types";

interface ISectionProps extends PropsWithChildren {
  bgColor?: TailwindBgColor;
}

export default function Section(props: ISectionProps) {
  return (
    <section className={cn("w-full h-[100dvh] relative", props.bgColor)}>
      {props.children}
    </section>
  );
}