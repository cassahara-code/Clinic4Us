import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconMap: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M1 6l7-3 8 3 7-3v15l-7 3-8-3-7 3z"/><path d="M8 3v15M16 6v15"/>

  </IconBase>
);
