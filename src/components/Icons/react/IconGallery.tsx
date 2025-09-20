import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconGallery: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 13l3-3 4 4 2-2 3 3"/>

  </IconBase>
);
