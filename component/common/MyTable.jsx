"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from "react";
import { useNotify } from "@/utils/notify";
import { debounce } from "lodash";

import { Input, Table, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const MyTable = forwardRef(
  (
    {
      columns = [],
      fetchFunction = null,
      rowKey = "id",
      className = "",
      title = "",
      description = "",
      searchable = true,
      actions = null,
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

    const [filters, setFilters] = useState({});
    const [sorter, setSorter] = useState({
      field: "created_at",
      order: "desc",
    });

    useImperativeHandle(ref, () => ({
      refresh: () => {
        fetchData();
      },
      getData: () => {
        return data;
      },
      getDataByRowKey: (item) => {
        return data.find((item) => item[rowKey] === item);
      }
    }));

    const fetchData = async (searchText = "") => {
      setLoading(true);
      try {
        const res = await fetchFunction(pagination, sorter, searchText, filters);
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
      debounce(async (searchText) => {
        await fetchData(searchText);
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

    if (!fetchFunction) {
      return <div>No fetch function provided</div>;
    }

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
            {actions && (
              <div className="flex space-x-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    type={action.type || "default"}
                    icon={action.icon}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        {searchable && (
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
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
        />
      </div>
    );
  }
);

export default MyTable;
