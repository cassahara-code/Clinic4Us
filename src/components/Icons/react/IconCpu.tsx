import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconCpu: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="7" y="7" width="10" height="10" rx="2"/><path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3"/>

  </IconBase>
);
