import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconHospital: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 6v12"/><path d="M6 12h12"/>

  </IconBase>
);
