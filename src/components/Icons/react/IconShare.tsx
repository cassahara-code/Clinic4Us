import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconShare: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="6" cy="12" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 12l8-6M8 12l8 6"/>

  </IconBase>
);
