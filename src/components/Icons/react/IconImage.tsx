import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconImage: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M3 18l6-6 4 4 2-2 6 6"/>

  </IconBase>
);
