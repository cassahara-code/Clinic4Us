import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconClock: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>

  </IconBase>
);
