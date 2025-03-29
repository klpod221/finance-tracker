"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { formatDate, formatMoney, singularize } from "@/utils/helpers";

import IconByName from "./IconByName";

import {
  Button,
  Popconfirm,
  Card,
  Progress,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

export default function CardItem({ item, slug, title, onEdit, onDelete }) {
  const router = useRouter();

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        size="small"
        className="w-full hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
        style={{ borderLeft: `5px solid ${item.color}` }}
        actions={[
          <Tooltip title="View Details" key="view">
            <Button
              type="link"
              icon={<InfoCircleOutlined />}
              className="hover:scale-125 transition-transform"
              onClick={() =>
                router.push(`/${slug || title.toLowerCase()}/${item.id}`)
              }
            />
          </Tooltip>,
          <Tooltip title="Edit" key="edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              className="hover:scale-125 transition-transform"
              onClick={onEdit}
            />
          </Tooltip>,
          <Popconfirm
            title={`Are you sure to delete this ${singularize(title)}?`}
            onConfirm={() => onDelete(item.id)}
          >
            <Tooltip title="Delete" key="delete">
              <Button
                type="link"
                icon={<DeleteOutlined />}
                className="hover:scale-125 transition-transform"
              />
            </Tooltip>
          </Popconfirm>,
        ]}
      >
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center justify-center">
            <div
              className="p-2 rounded-full w-fit h-fit flex items-center justify-center"
              style={{ backgroundColor: item.color + "30" }}
            >
              <IconByName className="text-xl" name={item.icon} />
            </div>

            {item.type && (
              <p
                className={`text-[10px] font-semibold mt-2 ${
                  item.type === "income" ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.type}
              </p>
            )}
          </div>

          <div className="flex-1">
            <h3
              className="text-lg font-semibold line-clamp-1"
              style={{ color: item.color }}
            >
              {item.name}
            </h3>

            <p className="text-gray-600 text-sm line-clamp-2">
              {item.description || (
                <span className="text-gray-400 italic">No description</span>
              )}
            </p>

            {/* date or created_at */}
            {item.date || item.created_at ? (
              <p className="text-xs text-gray-500">
                {formatDate(item.date || item.created_at)}
              </p>
            ) : null}

            {item.budget != undefined && (
              <div className="mt-2">
                <Progress
                  percent={Math.min((item.spent / item.budget) * 100, 100)}
                  size="small"
                  status={item.spent >= item.budget ? "exception" : "active"}
                />
                <p className="text-xs text-gray-500">
                  {formatMoney(0)} / {formatMoney(item.budget)}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
