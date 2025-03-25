"use client";

import { useState } from "react";

import { useUserStore } from "@/store/userStore";

import { formatMoney } from "@/utils/helpers";

import { Button, Space, Tooltip } from "antd";
import {
  ReloadOutlined,
  WalletOutlined,
  DollarCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

export default function UserBalance() {
  const [loading, setLoading] = useState(false);

  const { user, refreshUser } = useUserStore();

  const fetchBalance = async () => {
    setLoading(true);
    try {
      await refreshUser();
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title="Click to refresh balance" placement="bottom">
      <Button
        type="text"
        icon={<span className="text-xl">💰</span>}
        loading={loading}
        onClick={fetchBalance}
        className="!bg-green-200 !px-4 !py-4"
      >
        <span className="text-lg font-semibold">
          {formatMoney(user.balance)}
        </span>
      </Button>
    </Tooltip>
  );
}
