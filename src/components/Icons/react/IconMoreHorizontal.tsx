import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconMoreHorizontal: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>

  </IconBase>
);
