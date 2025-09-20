import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconTruck: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="8" width="13" height="8" rx="2"/><path d="M16 12h3l2 2v2h-5z"/><circle cx="8" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>

  </IconBase>
);
