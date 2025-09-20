import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconToggleHalf: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="2" y="8" width="20" height="8" rx="4"/><rect x="2" y="8" width="10" height="8" rx="4"/>

  </IconBase>
);
