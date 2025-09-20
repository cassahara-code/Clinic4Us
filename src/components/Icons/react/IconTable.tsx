import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconTable: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 12h18M9 7v12M15 7v12"/>

  </IconBase>
);
