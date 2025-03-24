"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useRef,
} from "react";
import { useNotify } from "@/utils/notify";
import { debounce } from "lodash";
import dayjs from "dayjs";

import { singularize } from "@/utils/helpers";

import { Input, Table, Button, Modal, Form, Space, Popconfirm } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

/**
 * MyTable component
 *
 * This component is a reusable table component that fetches data from a given function,
 * supports searching, sorting, and pagination.
 * It also allows for custom actions and form handling.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Array} props.columns - The columns configuration for the table
 * @param {Function} props.fetchFunction - The function to fetch data
 * @param {Function} props.createFunction - The function to create a new item (optional)
 * @param {Function} props.updateFunction - The function to update an item (optional)
 * @param {Function} props.deleteFunction - The function to delete an item (optional)
 * @param {string} props.rowKey - The key to identify each row (default: "id")
 * @param {string} props.className - Additional class names for the table
 * @param {string} props.title - The title of the table
 * @param {string} props.description - The description of the table
 * @param {boolean} props.searchable - Whether to show the search input (default: true)
 * @param {ReactNode} props.additional - Additional tools or buttons to show in the header
 * @param {ReactNode} props.dataForm - The form component for creating/editing items
 * @param {Object} props.formProps - Additional props to pass to the form component
 * @param {React.Ref} ref - The ref to expose
 * @returns {JSX.Element} The rendered component
 */
const MyTable = forwardRef(
  (
    {
      columns = [],
      fetchFunction = null,
      createFunction = null,
      updateFunction = null,
      deleteFunction = null,
      rowKey = "id",
      className = "",
      title = "",
      description = "",
      searchable = true,
      additional = null,
      dataForm: DataForm = null,
      formProps = {},
    },
    ref
  ) => {
    const notify = useNotify();

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

    useImperativeHandle(ref, () => ({
      refresh: () => {
        fetchData();
      },
    }));

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

    const handleTableChange = (pagination, filters, sorter) => {
      setPagination({ ...pagination });
      setFilters(filters);
      setSorter({
        field: sorter.field || "created_at",
        order: sorter.order === "descend" ? "desc" : "asc",
      });
    };

    if (
      !columns.some((col) => col.key === "actions") &&
      (updateFunction || deleteFunction)
    ) {
      columns.push({
        title: "Actions",
        key: "actions",
        fixed: "right",
        width: 100,
        render: (_, record) => (
          <Space>
            {updateFunction && (
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
            )}
            {deleteFunction && (
              <Popconfirm
                title="Are you sure?"
                description="This action cannot be undone."
                onConfirm={() => handleSubmit(record.id, deleteFunction)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            )}
          </Space>
        ),
      });
    }

    const handleSubmit = async (values, submitFunction) => {
      notify.loading("Submitting...");

      try {
        const res = selectedItem
          ? await submitFunction(selectedItem, values)
          : await submitFunction(values);

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
      } catch (error) {
        console.error("Error during submit:", error);
        notify.error("An error occurred, please try again.");
      }
    };

    useEffect(() => {
      fetchData();
    }, [pagination.current, sorter]);

    return (
      <div>
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

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey={rowKey}
          className={`${className}`}
          scroll={{ x: "max-content" }}
        />

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
      </div>
    );
  }
);

export default MyTable;
