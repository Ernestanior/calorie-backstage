'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Space, Tag, message } from 'antd';
import Query from './query';
import Filter from '@/components/form/filter';
import UserModify from './modify';
import UserDetail from './detail';
import { userList } from '@/network/api';
import PaginatedTable from '@/components/paginatedTable';

const UserListTemplate: FC = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState<any>({});
  const [modifyFlag, setModifyFlag] = useState(false);
  const [detailFlag, setDetailFlag] = useState(false);
  const [modifyItem, setModifyItem] = useState<any>({});
  const [detailItem, setDetailItem] = useState<any>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        searchPage: {
          page,
          pageSize,
          desc: 1,
          sort: 'create_date',
        },
      };

      // 添加搜索条件
      if (queryParams.id) {
        params.id = Number(queryParams.id);
      }
      if (queryParams.deviceId) {
        params.deviceId = queryParams.deviceId;
      }

      const res = await userList(params);
      // 兼容不同的响应格式
      const responseData = res?.data || res;
      if (responseData) {
        setData(responseData.content || []);
        setTotal(responseData.totalElements || 0);
      }
    } catch (e: any) {
      message.error('获取数据失败');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, queryParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleFilter = (params: any) => {
    setQueryParams(params);
    setPage(1); // 查询后重置分页
  };

  const refresh = () => {
    fetchData();
  };

  const onModify = (item: any) => {
    setModifyItem(item);
    setModifyFlag(true);
  };

  const onDetail = (item: any) => {
    setDetailItem(item);
    setDetailFlag(true);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    // 处理 "2025-12-02 18:32:20" 格式
    const dateStr = date.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2');
    try {
      return new Date(dateStr).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return date;
    }
  };

  const langMap: { [key: string]: string } = {
    'zh_CN': '中文',
    'en_US': '英文',
    'ja_JP': '日语',
    'th_TH': '泰语',
    'ko_KR': '韩语',
    'fr_FR': '法语',
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 120,
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      width: 280,
      render: (text: string) => text || '-',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 80,
      render: (age: number) => age !== undefined && age !== null ? age : '-',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 80,
      render: (gender: number) => {
        if (gender === 1) return '男';
        if (gender === 2) return '女';
        return gender !== undefined && gender !== null ? gender : '-';
      },
    },
    {
      title: '语言',
      dataIndex: 'lang',
      width: 100,
      render: (lang: string) => lang ? (langMap[lang] || lang) : '-',
    },
    {
      title: '身高 (cm)',
      dataIndex: 'height',
      width: 100,
      render: (height: number) => height !== undefined && height !== null ? height : '-',
    },
    {
      title: '目标步数',
      dataIndex: 'targetStep',
      width: 100,
      render: (step: number) => step !== undefined && step !== null ? step : '-',
    },
    {
      title: '是否删除',
      dataIndex: 'deleted',
      width: 100,
      render: (deleted: number) => (
        deleted ? <Tag color="red">是</Tag> : <Tag color="green">否</Tag>
      ),
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      className: 'action-cell',
      render: (_: any, item: any) => (
        <Space size="middle">
          <span 
            onClick={() => onDetail(item)} 
            className="action-link"
          >
            详情
          </span>
          <span 
            onClick={() => onModify(item)} 
            className="action-link"
          >
            修改
          </span>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PaginatedTable
        columns={columns}
        data={data}
        total={total}
        current={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        loading={loading}
        layout={{
          
          filter: (
            <Filter submit={handleFilter}>
              <Query />
            </Filter>
          ),
        }}
      />
      <UserDetail
        visible={detailFlag}
        data={detailItem}
        onCancel={() => setDetailFlag(false)}
      />
      <UserModify
        visible={modifyFlag}
        data={modifyItem}
        onCancel={() => setModifyFlag(false)}
        onRefresh={refresh}
      />
    </div>
  );
};

export default UserListTemplate;

