import { Tag } from "antd";

export default function TagType({ type }) {
  const typeMap = {
    income: { color: "#a0dc50", label: "Income" },
    expense: { color: "red", label: "Expense" },
  };

  const { color, label } = typeMap[type] || { color: "gray", label: "Unknown" };

  return <Tag color={color}>{label}</Tag>;
}
