import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconInfo: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10"/><path d="M12 10v6"/><circle cx="12" cy="7" r="1"/>

  </IconBase>
);
