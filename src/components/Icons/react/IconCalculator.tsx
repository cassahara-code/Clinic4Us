import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconCalculator: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 12h2M12 12h2M16 12h2M8 16h2M12 16h2M16 16h2"/>

  </IconBase>
);
