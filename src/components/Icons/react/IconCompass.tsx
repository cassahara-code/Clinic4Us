import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconCompass: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9"/><polygon points="12,7 15,15 9,15"/>

  </IconBase>
);
