import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconRoute: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M6 6a3 3 0 1 1 3 3h6a3 3 0 1 1-3 3H9a3 3 0 1 1-3 3"/><circle cx="6" cy="6" r="1"/><circle cx="18" cy="12" r="1"/><circle cx="6" cy="18" r="1"/>

  </IconBase>
);
