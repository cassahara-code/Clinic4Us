import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconMicroscope: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M6 20h12"/><path d="M9 20V9l3-3 3 3v3H9"/><circle cx="15" cy="10" r="2"/>

  </IconBase>
);
