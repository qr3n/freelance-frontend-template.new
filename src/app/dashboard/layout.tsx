import React, { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <div vaul-drawer-wrapper="" className={"bg-white"}>
      {props.children}
    </div>
  );
}
