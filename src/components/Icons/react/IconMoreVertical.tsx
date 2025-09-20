import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconMoreVertical: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="6" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="18" r="1"/>

  </IconBase>
);
