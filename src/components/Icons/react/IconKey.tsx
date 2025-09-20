import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconKey: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="7" cy="12" r="3"/><path d="M10 12h11"/><path d="M18 12v-3"/><path d="M21 12v-3"/>

  </IconBase>
);
