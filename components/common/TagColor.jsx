import { Tag } from "antd";

export default function TagColor({ color, label = "" }) {
  if (!color) {
    return <Tag color="gray">Unknown</Tag>;
  }

  // check if color is white or black
  const isWhite = color === "#ffffff" || color === "white";

  return (
    <Tag
      color={color}
      className={`${isWhite ? "!border !border-[#a0dc50] !text-black !bg-white" : ""}`}
      style={{
        backgroundColor: isWhite ? "#ffffff" : color,
        color: isWhite ? "#000000" : "#ffffff",
        borderColor: isWhite ? "#a0dc50" : color,
      }}
    >
      {label || color || "Unknown"}
    </Tag>
  );
}
