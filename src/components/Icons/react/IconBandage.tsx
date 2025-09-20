import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconBandage: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="4" y="9" width="16" height="6" rx="3"/><circle cx="12" cy="12" r="1"/><path d="M8 9v6M16 9v6"/>

  </IconBase>
);
