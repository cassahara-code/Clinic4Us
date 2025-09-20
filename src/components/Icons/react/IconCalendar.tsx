import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconCalendar: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/>

  </IconBase>
);
