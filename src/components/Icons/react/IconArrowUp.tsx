import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconArrowUp: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M5 12l7-7 7 7"/><path d="M12 5v14"/>

  </IconBase>
);
