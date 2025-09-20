import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconSearch: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>

  </IconBase>
);
