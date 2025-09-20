import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconTrash: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M3 6h18"/><path d="M8 6V4h8v2"/><rect x="6" y="6" width="12" height="14" rx="1"/><path d="M10 10v6M14 10v6"/>

  </IconBase>
);
