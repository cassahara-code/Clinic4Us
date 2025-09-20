import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconBackpack: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="6" y="6" width="12" height="12" rx="3"/><path d="M12 3v3"/><path d="M8 10h8"/><path d="M8 14h8"/>

  </IconBase>
);
