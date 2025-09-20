import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconReceipt: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="6" y="3" width="12" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h6"/><path d="M6 21l2-2 2 2 2-2 2 2 2-2 2 2"/>

  </IconBase>
);
