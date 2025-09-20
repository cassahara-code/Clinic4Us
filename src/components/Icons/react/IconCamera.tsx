import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconCamera: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 6l2-3h2l2 3"/><circle cx="12" cy="13" r="3"/>

  </IconBase>
);
