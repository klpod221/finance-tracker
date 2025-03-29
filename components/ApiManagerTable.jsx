"use client";

import { search, create, update, remove, changeStatus } from "@/actions/api";

import { formatDate } from "@/utils/helpers";
import { useNotify } from "@/utils/notify";

import { CopyOutlined } from "@ant-design/icons";

import MyTable from "@/components/MyTable";
import ApiForm from "@/components/forms/ApiForm";
import { Button } from "antd";

export default function ApiManagerTable() {
  const notify = useNotify();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      sorter: true,
      render: (key) => {
        return (
          <div className="flex items-center gap-2">
            <span>
              {key.slice(0, 8) + "..." + key.slice(-4)}
            </span>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(key);
                notify.success("Key copied to clipboard");
              }}
              className="text-gray-500 hover:text-gray-700"
            />
          </div>
        );
      }
    },
    {
      title: "Last Used",
      dataIndex: "last_used",
      key: "last_used",
      sorter: true,
      render: (lastUsed) => formatDate(lastUsed),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      render: (createdAt) => formatDate(createdAt),
    },
  ];

  return (
    <div className="mt-4">
      <MyTable
        title="API Manager"
        description="Manage your API keys here"
        slug="API"
        columns={columns}
        fetchFunction={search}
        createFunction={create}
        updateFunction={update}
        deleteFunction={remove}
        statusFunction={changeStatus}
        dataForm={ApiForm}
      />
    </div>
  );
}
