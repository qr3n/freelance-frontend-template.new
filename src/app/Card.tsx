import { PropsWithChildren } from "react";
import { cn } from "@/shared/shadcn/lib/utils";
import { TailwindBgColor } from "@/shared/types";

interface ICardProps extends PropsWithChildren {
  bgColor: TailwindBgColor;
}

export default function Card(props: ICardProps) {
  return (
    <div className={cn("px-20 py-8 rounded-[36px] h-[600px]", props.bgColor)}>
      <h1 className="font-bold text-white text-3xl">Ресторан</h1>
    </div>
  );
}