'use client';

import React from 'react';
import { Skeleton } from 'antd';

export default function Loading() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Skeleton.Input active size="large" style={{ width: 200, height: 32 }} />
          </h1>
        </div>
      </div>
      <div className="card">
        <Skeleton
          active
          paragraph={{ rows: 6, width: ['90%', '95%', '92%', '88%', '94%', '90%'] }}
          title={{ width: '40%' }}
        />
      </div>
    </div>
  );
}

