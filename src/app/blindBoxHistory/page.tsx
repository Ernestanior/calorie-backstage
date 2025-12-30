'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Space, Tag, message, Image } from 'antd';
import BlindBoxHistoryDetail from './detail';
import Query from './query';
import Filter from '@/components/form/filter';
import { yifanRecipeResponsePage } from '@/network/api';
import PaginatedTable from '@/components/paginatedTable';
import dayjs from 'dayjs';

const BlindBoxHistoryTemplate: FC = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState<any>({});
  const [detailFlag, setDetailFlag] = useState(false);
  const [detailItem, setDetailItem] = useState<any>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        searchPage: {
          page: page - 1,
          pageSize,
          desc: 1,
          sort: 'id',
        },
        type: 2, // 盲盒历史
      };

      // 添加搜索条件
      if (queryParams.id) {
        params.id = Number(queryParams.id);
      }
      if (queryParams.userId) {
        params.userId = Number(queryParams.userId);
      }
      if (queryParams.mealType) {
        params.mealType = Number(queryParams.mealType);
      }
      if (queryParams.mealName) {
        params.mealName = queryParams.mealName;
      }
      if (queryParams.createDate) {
        // 将日期转换为 YYYY-MM-DD 格式
        // DatePicker 返回的是 dayjs 对象，可以直接调用 format
        params.createDate = dayjs(queryParams.createDate).format('YYYY-MM-DD');
      }

      const res = await yifanRecipeResponsePage(params);
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

  const onDetail = (item: any) => {
    setDetailItem(item);
    setDetailFlag(true);
  };

  const mealTypeMap: { [key: number]: string } = {
    1: '早餐',
    2: '午餐',
    3: '晚餐',
    4: '加餐',
  };

  const typeMap: { [key: number]: string } = {
    1: '料理历史',
    2: '盲盒历史',
  };

  const columns = [
    {
      title: '图片',
      dataIndex: 'responseDto',
      width: 120,
      render: (responseDto: any, record: any) => {
        const imageUrl = responseDto?.imageUrl;
        if (!imageUrl) return '-';
        return (
          <Image
            src={imageUrl}
            alt={record.mealName || '食谱图片'}
            width={100}
            height={100}
            style={{ 
              height: 100,
              objectFit: 'cover',
              borderRadius: 8,
              border: '1px solid #f0f0f0',
            }}
            preview={{ 
              src: imageUrl,
              mask: '预览',
            }}
          />
        );
      },
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 120,
      render: (userId: number) => userId !== undefined && userId !== null ? userId : '-',
    },
    {
      title: '餐类',
      dataIndex: 'mealType',
      width: 100,
      render: (mealType: number) => mealTypeMap[mealType] || mealType || '-',
    },
    {
      title: '餐名',
      dataIndex: 'mealName',
      width: 200,
      render: (name: string) => name || '-',
    },
    {
      title: '食材列表',
      dataIndex: 'ingredientList',
      width: 300,
      render: (ingredientList: string[]) => {
        if (!ingredientList || ingredientList.length === 0) return '-';
        return ingredientList.join(', ');
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
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
          header: {
            title: '盲盒历史',
            description: '查看和管理用户的盲盒生成历史记录',
          },
          filter: (
            <Filter submit={handleFilter}>
              <Query />
            </Filter>
          ),
        }}
      />
      <BlindBoxHistoryDetail
        visible={detailFlag}
        data={detailItem}
        onCancel={() => setDetailFlag(false)}
      />
    </div>
  );
};

export default BlindBoxHistoryTemplate;

