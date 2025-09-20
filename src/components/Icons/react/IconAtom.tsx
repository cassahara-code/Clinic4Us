import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconAtom: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="1"/><path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z"/><path d="M6 6c3 2 9 2 12 0M6 18c3-2 9-2 12 0"/>

  </IconBase>
);
