import * as React from "react";
import { IconBase, IconProps } from "./IconBase";

export const IconAmbulance: React.FC<IconProps> = (props) => (
  <IconBase {...props}>
    <rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 9V6h5v3"/><path d="M8 7h1M6 13h6"/><circle cx="8" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>

  </IconBase>
);
