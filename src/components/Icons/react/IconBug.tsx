import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconBug: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="4"/><path d="M8 8l-2-2M16 8l2-2M8 16l-2 2M16 16l2 2"/><path d="M4 12h16M12 8v8"/>

  </IconBase>
);
