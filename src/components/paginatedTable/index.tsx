// components/paginatedTable/index.tsx
'use client';
import React from 'react';
import { Table } from 'antd';
import type { TablePaginationConfig, ColumnsType } from 'antd/es/table';

interface PaginatedTableProps<T> {
  data: T[];
  total: number;
  columns: ColumnsType<T>;
  current: number;
  pageSize: number;
  rowKey?: string;
  onPageChange: (page: number, pageSize: number) => void;
  loading?: boolean;
}

function PaginatedTable<T extends object>({
  data,
  total,
  columns,
  current,
  pageSize,
  rowKey = 'id',
  onPageChange,
  loading = false,
}: PaginatedTableProps<T>) {
  const pagination: TablePaginationConfig = {
    current,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    onChange: onPageChange,
  };
  
  return (
    <Table
      rowKey={rowKey}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      loading={loading}
    />
  );
}

export default PaginatedTable;
