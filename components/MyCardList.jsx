"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { debounce } from "lodash";

import { create } from "@/actions/transactions";

import { useNotify } from "@/utils/notify";
import { singularize } from "@/utils/helpers";

import { Input, Button, Modal, Form, Pagination, Skeleton, Empty } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import TransactionForm from "./forms/TransactionForm";
import CardItem from "./CardItem";

export default function MyCardList({
  title,
  slug,
  description,
  fetchFunction = null,
  createFunction = null,
  updateFunction = null,
  deleteFunction = null,
  dataForm: DataForm = null,
}) {
  const notify = useNotify();

  const keywords = useRef("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [modal, setModal] = useState({
    visible: false,
    mode: "create",
    item: null,
  });

  const [form] = Form.useForm();
  const [transactionForm] = Form.useForm();

  const fetchData = useCallback(async () => {
    console.log("Fetching data with keywords:", keywords.current);
    setLoading(true);
    try {
      const res = await fetchFunction(pagination, keywords.current);
      setData(res.data);
      setPagination(res.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
      notify.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  const handleSearch = useCallback(debounce(fetchData, 300), [fetchData]);

  const handleSubmit = async (values) => {
    notify.loading("Submitting...");
    console.log("Submitting values:", values);

    try {
      if (modal.mode === "edit") {
        await updateFunction(modal.item.id, values);
      } else if (modal.mode === "create") {
        await createFunction(values);
      } else if (modal.mode === "transaction") {
        await create(values);
      }

      notify.success("Success!");

      setModal({ visible: false, mode: "create", item: null });

      form.resetFields();
      transactionForm.resetFields();

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
  }, [pagination.current]);

  const SkeletonList = useMemo(() => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {Array.from({ length: pagination.pageSize }).map((_, index) => (
          <Skeleton key={index} active />
        ))}
      </div>
    );
  }, [pagination.pageSize]);

  const EmptyList = useMemo(() => {
    return (
      <div className="flex items-center justify-center h-full">
        <Empty description={`No ${title} found`} />
      </div>
    );
  }, [title]);

  const CardGrid = useMemo(() => {
    return (
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data.map((item) => (
          <CardItem
            key={item.id}
            item={item}
            slug={slug}
            title={title}
            onDelete={handleDelete}
            onEdit={() => {
              setModal({ visible: true, mode: "edit", item });
              form.setFieldsValue(item);
            }}
          />
        ))}
      </div>
    );
  }, [data, slug, title, handleDelete, setModal, form]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-500">{description}</p>
        </div>
        <div>
          <div className="flex space-x-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setModal({ visible: true, mode: "create", item: null });
                form.resetFields();
              }}
            >
              Add {singularize(title)}
            </Button>

            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => {
                setModal({ visible: true, mode: "transaction", item: null });
                transactionForm.resetFields();
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

      {loading ? (
        SkeletonList
      ) : data.length === 0 ? (
        EmptyList
      ) : (
        <>
          {CardGrid}
          <div className="flex justify-center mt-4">
            <Pagination
              {...pagination}
              onChange={(page, pageSize) =>
                setPagination((prev) => ({ ...prev, current: page, pageSize }))
              }
            />
          </div>
        </>
      )}

      <Modal
        title={`${
          modal.mode === "transaction"
            ? "Add Transaction"
            : modal.mode === "edit"
            ? "Edit"
            : "Add"
        } ${title}`}
        open={modal.visible}
        onCancel={() => {
          setModal({ visible: false, mode: "create", item: null });
          form.resetFields();
          transactionForm.resetFields();
        }}
        onOk={() => {
          if (modal.mode === "transaction") {
            transactionForm.submit();
          } else {
            form.submit();
          }
        }}
      >
        {modal.mode === "transaction" ? (
          <TransactionForm
            form={transactionForm}
            onFinish={handleSubmit}
            categories={true}
          />
        ) : (
          <DataForm form={form} onFinish={handleSubmit} />
        )}
      </Modal>
    </>
  );
}
