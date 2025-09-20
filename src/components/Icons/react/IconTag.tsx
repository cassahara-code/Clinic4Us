import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconTag: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M3 12l9-9h9v9l-9 9-9-9z"/><circle cx="18" cy="6" r="1.5"/>

  </IconBase>
);
