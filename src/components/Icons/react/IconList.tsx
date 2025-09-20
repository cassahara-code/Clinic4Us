import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconList: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>

  </IconBase>
);
