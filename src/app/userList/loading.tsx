'use client';

import React from 'react';
import { Skeleton } from 'antd';
import PaginatedTable from '@/components/paginatedTable';

export default function Loading() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Skeleton.Input active size="large" style={{ width: 200, height: 32 }} />
          </h1>
          <p className="page-description">
            <Skeleton.Input active size="small" style={{ width: 300, height: 20, marginTop: 8 }} />
          </p>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="action-bar-filter">
          <Skeleton active paragraph={{ rows: 0 }} title={{ width: '100%' }} />
        </div>
      </div>
      <div className="table-container">
        <div className="table-skeleton">
          <Skeleton
            active
            paragraph={{ rows: 8, width: ['90%', '95%', '92%', '88%', '94%', '90%', '93%', '91%'] }}
            title={{ width: '40%' }}
          />
        </div>
      </div>
    </div>
  );
}

