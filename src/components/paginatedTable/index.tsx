// components/paginatedTable/index.tsx
'use client';
import React, { ReactNode } from 'react';
import { Table, Button, Skeleton } from 'antd';
import type { TablePaginationConfig, ColumnsType } from 'antd/es/table';
import type { ButtonProps } from 'antd';

type ActionButtonConfig = Omit<ButtonProps, 'children'> & {
  label: ReactNode;
};

interface LayoutConfig {
  header?: {
    title: string;
    description?: string;
    extra?: ReactNode;
  };
  actions?: {
    primary?: ActionButtonConfig;
    secondary?: ActionButtonConfig[];
    extra?: ReactNode;
  };
  filter?: ReactNode;
  footer?: ReactNode;
}

interface PaginatedTableProps<T> {
  data: T[];
  total: number;
  columns: ColumnsType<T>;
  current: number;
  pageSize: number;
  rowKey?: string;
  onPageChange: (page: number, pageSize: number) => void;
  loading?: boolean;
  layout?: LayoutConfig;
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
  layout,
}: PaginatedTableProps<T>) {
  const pagination: TablePaginationConfig = {
    current,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: true,
    onChange: onPageChange,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    style: {
      marginTop: 24,
      padding: '0 24px 24px 24px',
    },
  };

  const renderButton = (
    config: ActionButtonConfig | undefined,
    key: React.Key,
    isPrimary = false,
  ) => {
    if (!config) return null;
    const { label, style, size, type, ...rest } = config;
    return (
      <Button
        key={key}
        type={type || (isPrimary ? 'primary' : 'default')}
        size={size || 'large'}
        style={{
          height: 44,
          paddingLeft: 28,
          paddingRight: 28,
          fontWeight: isPrimary ? 600 : 500,
          ...style,
        }}
        {...rest}
      >
        {label}
      </Button>
    );
  };

  const tableNode = (
    <Table
      rowKey={rowKey}
      columns={columns}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      scroll={{ x: 'max-content' }}
      style={{
        background: 'transparent',
      }}
      rowClassName={(_, index) =>
        index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
      }
    />
  );

  if (!layout) {
    return tableNode;
  }

  const initialLoading = loading && data.length === 0;

  return (
    <div>
      {layout.header && (
        <div className="page-header">
          <div>
            <h1 className="page-title">{layout.header.title}</h1>
            {layout.header.description && (
              <p className="page-description">{layout.header.description}</p>
            )}
          </div>
          {layout.header.extra && (
            <div className="page-header-extra">{layout.header.extra}</div>
          )}
        </div>
      )}

      {(layout.actions || layout.filter) && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="action-bar">
            {(layout.actions?.primary ||
              layout.actions?.secondary?.length ||
              layout.actions?.extra) && (
              <div className="action-bar-buttons">
                {renderButton(layout.actions?.primary, 'primary', true)}
                {layout.actions?.secondary?.map((btn, index) =>
                  renderButton(btn, `secondary-${index}`),
                )}
                {layout.actions?.extra}
              </div>
            )}
            {layout.filter && (
              <div className="action-bar-filter">{layout.filter}</div>
            )}
          </div>
        </div>
      )}

      <div className="table-container">
        {initialLoading ? (
          <div className="table-skeleton">
            <Skeleton
              active
              paragraph={{ rows: 6, width: ['90%', '95%', '92%', '88%', '94%', '90%'] }}
              title={{ width: '40%' }}
            />
          </div>
        ) : (
          tableNode
        )}
        {layout.footer && (
          <div className="table-footer">{layout.footer}</div>
        )}
      </div>
    </div>
  );
}

export default PaginatedTable;
