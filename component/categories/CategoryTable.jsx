"use client";

import React, { useRef, useState } from "react";
import { useNotify } from "@/utils/notify";

import MyTable from "../common/MyTable";

import { create, search, update, remove } from "@/actions/categories";

import { Button, Modal, Form, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import * as Icons from "@ant-design/icons";
import { formatDate } from "@/utils/helpers";
import CategoryForm from "./CategoryForm";

export default function Table() {
  const notify = useNotify();
  const tableRef = useRef();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [selectedItem, setSelectedItem] = useState(null);

  const showModal = () => setIsCreateModalOpen(true);
  const handleCancel = (type) => {
    if (type === "create") {
      setIsCreateModalOpen(false);
    } else {
      setIsEditModalOpen(false);
      setSelectedItem(null);
    }
    createForm.resetFields();
    editForm.resetFields();
  };

  const handleCreate = async (formData) => {
    notify.loading("Creating category...");
    try {
      const res = await create(formData);
      if (res.error) {
        throw new Error(res.error.message);
      }
      notify.success("Category created successfully");
      handleCancel("create");
      tableRef.current.refresh();
    } catch (error) {
      console.error("Error creating category:", error);
      notify.error("Failed to create category");
    } finally {
      handleCancel("create");
    }
  };

  const handleUpdate = async (formData) => {
    notify.loading("Updating category...");
    try {
      const res = await update(selectedItem, formData);
      if (res.error) {
        throw new Error(res.error.message);
      }
      notify.success("Category updated successfully");
      handleCancel("edit");
      tableRef.current.refresh();
    } catch (error) {
      console.error("Error updating category:", error);
      notify.error("Failed to update category");
    } finally {
      handleCancel("edit");
    }
  };

  const onDelete = async (id) => {
    notify.loading("Deleting category...");
    try {
      const res = await remove(id);
      if (res.error) {
        throw new Error(res.error.message);
      }

      notify.success("Category deleted successfully");
      tableRef.current.refresh();
    } catch (error) {
      console.error("Error deleting category:", error);
      notify.error("Failed to delete category");
    }
  };

  const columns = [
    {
      title: "Icon",
      dataIndex: "icon",
      render: (icon) => {
        const Icon = Icons[icon];
        return Icon ? <Icon className="text-xl" /> : null;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      render: (name) => <span>{name}</span>,
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
      render: (type) => (
        <Tag color={type === "income" ? "green" : "red"}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Color",
      dataIndex: "color",
      render: (color) => (
        <Tag
          color={color}
          className={`${
            color === "#ffffff" ? "!text-black !border !border-[#a0dc50]" : ""
          }`}
        >
          {color}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      sorter: true,
      render: (createdAt) => <span>{formatDate(createdAt)}</span>,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedItem(record.id);
              editForm.setFieldsValue(record);
              setIsEditModalOpen(true);
            }}
          />
          <Popconfirm
            title="Are you sure?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(record.id)}
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
    <div className="w-full">
      <MyTable
        columns={columns}
        className="mt-4"
        fetchFunction={search}
        title="Categories"
        description="Manage your categories for transactions"
        actions={[
          {
            label: "Add Category",
            icon: <PlusOutlined />,
            type: "primary",
            onClick: showModal,
          },
        ]}
        ref={tableRef}
      />

      <Modal
        title="Add Category"
        open={isCreateModalOpen}
        onCancel={() => handleCancel("create")}
        onOk={() => {
          createForm.submit();
        }}
      >
        <CategoryForm
          form={createForm}
          onFinish={handleCreate}
          initialValues={{
            icon: "DollarOutlined",
            color: "#a0dc50",
          }}
        />
      </Modal>

      <Modal
        title="Edit Category"
        open={isEditModalOpen}
        onCancel={() => handleCancel("edit")}
        onOk={() => {
          editForm.submit();
        }}
      >
        <CategoryForm
          form={editForm}
          onFinish={handleUpdate}
          initialValues={{
            icon: "DollarOutlined",
            color: "#a0dc50",
          }}
        />
      </Modal>
    </div>
  );
}
