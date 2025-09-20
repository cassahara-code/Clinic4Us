import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconUserAdd: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="8" r="4"/><path d="M6 20a6 6 0 0 1 12 0"/><path d="M19 8h4M21 6v4"/>

  </IconBase>
);
