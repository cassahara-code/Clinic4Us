import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconPill: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="5" y="7" width="14" height="10" rx="5"/><path d="M12 8l6 6"/>

  </IconBase>
);
