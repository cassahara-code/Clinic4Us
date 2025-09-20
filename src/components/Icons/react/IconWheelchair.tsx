import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconWheelchair: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <circle cx="8" cy="18" r="3"/><path d="M8 15V8h4l2 3h3"/><path d="M14 16l-2-4"/>

  </IconBase>
);
