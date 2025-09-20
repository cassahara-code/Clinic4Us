import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconArrowRight: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M12 5l7 7-7 7"/><path d="M5 12h14"/>

  </IconBase>
);
