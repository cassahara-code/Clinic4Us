import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconHelp: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 1 1 5 2 3 3 0 0 0-2 3"/><path d="M12 17h0.01"/>

  </IconBase>
);
