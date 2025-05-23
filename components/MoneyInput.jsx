import { InputNumber } from "antd";

export default function MoneyInput({
  currency = "VND",
  decimalSeparator = ".",
  thousandSeparator = ",",
  decimalScale = 2,
  fixedDecimalScale = true,
  min = 0,
  ...props
}) {
  return (
    <InputNumber
      min={min <= 0 ? 0 : min}
      formatter={(value) =>
        value
          ? `${value.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)}`
          : ""
      }
      parser={(value) =>
        value
          .replace(new RegExp(`\\${thousandSeparator}`, "g"), "")
          .replace(new RegExp(`\\${decimalSeparator}`), ".")
      }
      addonAfter={currency}
      className="w-full"
      {...props}
    />
  );
}
