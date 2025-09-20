import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconProgress: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="11" width="8" height="2" rx="1"/>

  </IconBase>
);
