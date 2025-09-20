import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconLink: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M10 13a5 5 0 0 1 0-7l2-2a5 5 0 0 1 7 7l-1 1"/><path d="M14 11a5 5 0 0 1 0 7l-2 2a5 5 0 0 1-7-7l1-1"/>

  </IconBase>
);
