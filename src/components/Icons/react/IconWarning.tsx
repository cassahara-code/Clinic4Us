import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconWarning: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <path d="M12 2l10 18H2z"/><path d="M12 8v6"/><circle cx="12" cy="18" r="1"/>

  </IconBase>
);
