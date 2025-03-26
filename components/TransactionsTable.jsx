"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";
import dayjs from "dayjs";

import { useUserStore } from "@/store/userStore";

import { useNotify } from "@/utils/notify";
import { formatDate, formatMoney } from "@/utils/helpers";

import { create, search, update, remove } from "@/actions/transactions";
import { get as getCategory } from "@/actions/categories";

import TagType from "@/components/TagType";
import TransactionForm from "@/components/forms/TransactionForm";

import { Input, Table, Button, Modal, Form, Space, Popconfirm } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

export default function TransactionTable({
  categoryId = null,
  groupId = null,
}) {
  const notify = useNotify();
  const { refreshUser } = useUserStore();

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

  const [detailItem, setDetailItem] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await search(pagination, sorter, keywords.current, filters);
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

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({ ...pagination });
    setFilters(filters);
    setSorter({
      field: sorter.field || "created_at",
      order: sorter.order || "desc",
    });
  };

  const handleSubmit = async (values, submitFunction) => {
    notify.loading("Processing...");

    try {
      const formData = {
        ...values,
        category_id: categoryId,
        group_id: groupId,
      };

      const res = selectedItem
        ? await submitFunction(selectedItem, formData)
        : await submitFunction(formData);

      if (res.error) {
        throw new Error(res.error.message);
      }

      notify.success("Success!");

      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);

      createForm.resetFields();
      editForm.resetFields();

      setSelectedItem(null);

      fetchData();
      refreshUser();
    } catch (error) {
      console.error("Error submitting form:", error);
      notify.error("Failed to process request");
    }
  };

  const handleDelete = async (id) => {
    notify.loading("Deleting...");

    try {
      const res = await remove(id);
      if (res.error) {
        throw new Error(res.error.message);
      }

      notify.success("Deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
      notify.error("Failed to delete item");
    }
  }

  useEffect(() => {
    fetchData();
  }, [pagination.current, filters, sorter]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await getCategory(categoryId);
        setDetailItem(data);
      } catch (error) {
        console.error("Error fetching category:", error);
        notify.error("Failed to fetch category");
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: true,
      render: (text) => formatMoney(text),
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: true,
      filters: [
        { text: "Income", value: "income" },
        { text: "Expense", value: "expense" },
      ],
      filterMode: "tree",
      render: (type) => <TagType type={type} />,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedItem(record.id);
              editForm.setFieldsValue({
                ...record,
                date: dayjs(record.date),
              });
              setIsEditModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            Transactions {detailItem ? `in ${detailItem.name}` : ""}
          </h2>
          <p className="text-gray-500">
            List of transactions for the selected{" "}
            {categoryId && " category."}
            {groupId && " group."}
          </p>
        </div>
        <div>
          <div className="flex space-x-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsCreateModalOpen(true);
                createForm.resetFields();
              }}
            >
              Add Transaction
            </Button>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={fetchData}
            />
          </div>
        </div>
      </div>

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

      <Modal
        title="Create Transaction"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          createForm.resetFields();
        }}
        onOk={() => createForm.submit()}
        destroyOnClose
      >
        <TransactionForm
          form={createForm}
          onFinish={(values) => handleSubmit(values, create)}
          type={detailItem?.type}
        />
      </Modal>

      <Modal
        title="Edit Transaction"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        destroyOnClose
      >
        <TransactionForm
          form={editForm}
          onFinish={(values) => handleSubmit(values, update)}
          type={detailItem?.type}
        />
      </Modal>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />
    </>
  );
}
