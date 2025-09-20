import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconHome: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M3 10l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>
  </IconBase>
);
