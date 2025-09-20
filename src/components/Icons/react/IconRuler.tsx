import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconRuler: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="8" width="18" height="8" rx="2"/><path d="M6 8v4M9 8v4M12 8v4M15 8v4M18 8v4"/>

  </IconBase>
);
