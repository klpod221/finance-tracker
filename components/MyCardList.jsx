"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useNotify } from "@/utils/notify";
import { formatDate, formatMoney, singularize } from "@/utils/helpers";

import {
  Input,
  Button,
  Modal,
  Form,
  Pagination,
  Popconfirm,
  Card,
  Skeleton,
  Empty,
  Progress,
  Tooltip,
} from "antd";

import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import IconByName from "./IconByName";

export default function MyCardList({
  title,
  slug,
  description,
  additional,
  fetchFunction = null,
  createFunction = null,
  updateFunction = null,
  deleteFunction = null,
  refreshButton = true,
  searchable = true,
  dataForm: DataForm = null,
  formProps = {},
}) {
  const notify = useNotify();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const keywords = useRef("");

  const [filters, setFilters] = useState({});
  const [sorter, setSorter] = useState({
    field: "created_at",
    order: "desc",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchFunction(
        pagination,
        sorter,
        keywords.current,
        filters
      );
      setData(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
      notify.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce(async () => {
      await fetchData();
    }, 300),
    []
  );

  const handleSubmit = async (values, submitFunction) => {
    notify.loading("Submitting...");
    console.log("Submitting values:", values);

    try {
      selectedItem
        ? await submitFunction(selectedItem, values)
        : await submitFunction(values);

      notify.success("Success!");

      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      createForm.resetFields();
      editForm.resetFields();
      setSelectedItem(null);

      fetchData();
    } catch (error) {
      console.error("Error during submit:", error);
      notify.error(error.message || "Failed to submit");
    }
  };

  const handleDelete = async (id) => {
    notify.loading("Deleting...");
    try {
      await deleteFunction(id);
      notify.success("Deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      notify.error("Failed to delete item");
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, sorter]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-500">{description}</p>
        </div>
        <div>
          <div className="flex space-x-2">
            {additional}

            {createFunction && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsCreateModalOpen(true);
                  createForm.resetFields();
                }}
              >
                Add {singularize(title)}
              </Button>
            )}

            {refreshButton && (
              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={fetchData}
              />
            )}
          </div>
        </div>
      </div>

      {searchable && (
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => {
            keywords.current = e.target.value;
            handleSearch();
          }}
          className="mb-4"
        />
      )}

      {DataForm && (
        <>
          <Modal
            title={`Create ${singularize(title)}`}
            open={isCreateModalOpen}
            onCancel={() => {
              setIsCreateModalOpen(false);
              createForm.resetFields();
            }}
            onOk={() => createForm.submit()}
            destroyOnClose
          >
            <DataForm
              form={createForm}
              onFinish={(values) => handleSubmit(values, createFunction)}
              {...formProps}
            />
          </Modal>

          <Modal
            title={`Edit ${singularize(title)}`}
            open={isEditModalOpen}
            onCancel={() => {
              setIsEditModalOpen(false);
              editForm.resetFields();
            }}
            onOk={() => editForm.submit()}
            destroyOnClose
          >
            <DataForm
              form={editForm}
              onFinish={(values) => handleSubmit(values, updateFunction)}
              {...formProps}
            />
          </Modal>
        </>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: pagination.pageSize }).map((_, index) => (
            <Skeleton key={index} active />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <Empty description={`No ${title} found`} />
        </div>
      ) : (
        <>
          <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
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
                          router.push(
                            `/${slug || title.toLowerCase()}/${item.id}`
                          )
                        }
                      />
                    </Tooltip>,
                    updateFunction && (
                      <Tooltip title="Edit" key="edit">
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          className="hover:scale-125 transition-transform"
                          onClick={() => {
                            setIsEditModalOpen(true);
                            setSelectedItem(item.id);
                            editForm.setFieldsValue(item);
                          }}
                        />
                      </Tooltip>
                    ),
                    deleteFunction && (
                      <Popconfirm
                        title={`Are you sure to delete this ${singularize(
                          title
                        )}?`}
                        onConfirm={() => handleDelete(item.id)}
                      >
                        <Tooltip title="Delete" key="delete">
                          <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            className="hover:scale-125 transition-transform"
                          />
                        </Tooltip>
                      </Popconfirm>
                    ),
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
                            item.type === "income"
                              ? "text-green-500"
                              : "text-red-500"
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
                          <span className="text-gray-400 italic">
                            No description
                          </span>
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
                            percent={Math.min(
                              (item.spent / item.budget) * 100,
                              100
                            )}
                            size="small"
                            status={
                              item.spent >= item.budget ? "exception" : "active"
                            }
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
            ))}
          </div>

          {/* Paginate */}
          <div className="flex justify-center mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, pageSize) => {
                setPagination({ ...pagination, current: page, pageSize });
              }}
            />
          </div>
        </>
      )}
    </>
  );
}
