import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconTerminalSquare: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3"/><path d="M12 15h5"/>

  </IconBase>
);
