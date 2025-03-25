"use client";

import * as Icons from "@ant-design/icons";

export default function IconByName({ name, ...props }) {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Ant Design icons.`);
    return null;
  }

  return <IconComponent {...props} />;
}
