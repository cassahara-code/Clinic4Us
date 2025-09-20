import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconPrint: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="6" y="9" width="12" height="8" rx="2"/><path d="M8 9V5h8v4"/><rect x="8" y="14" width="8" height="5" rx="1"/>

  </IconBase>
);
