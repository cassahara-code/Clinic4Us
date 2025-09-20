import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconNavigation: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="10"/><path d="M12 2l4 10-10 4z"/>

  </IconBase>
);
