'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Space, Tag, Image, message } from 'antd';
import Query from './query';
import Filter from '@/components/form/filter';
import FoodCreate from './create';
import FoodModify from './modify';
import { foodDelete, foodPage } from '@/network/api';
import { foodList, heatList } from './config';
import PaginatedTable from '@/components/paginatedTable';

const FoodListTemplate: FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState({});
  const [createFlag, setCreateFlag] = useState(false);
  const [modifyFlag, setModifyFlag] = useState(false);
  const [modifyItem, setModifyItem] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await foodPage({
        ...queryParams,
        searchPage: {
          page,
          pageSize,
          desc: 0,
          sort: '',
        },
      });
      // 后端通过 ok(payload) 返回的数据结构为 { code, data: { number, size, totalPages, numberOfElements, totalElements, content } }
      const pageData = (res as any).data ?? res;
      const records = pageData?.content ?? [];
      const totalCount = pageData?.totalElements ?? 0;
      const serverPage = (pageData?.number ?? 0) + 1; // 后端从 0 开始
      const serverPageSize = pageData?.size ?? pageSize;

      // 将后端的 `type` 字段映射为前端展示用的 `types`，方便表格和表单复用
      const mapped = (records as any[]).map((item) => ({
        ...item,
        types: item.type ?? item.types,
      }));

      setData(mapped);
      setTotal(totalCount);
      setPage(serverPage);
      setPageSize(serverPageSize);
    } catch (e) {
      message.error('获取数据失败');
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

  const onDelete = async (id: number) => {
    await foodDelete({ id });
    refresh();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      width: 120,
      render: (url: string) => (
        <Image
          src={url}
          alt="菜品图片"
          width={100}
          height={100}
          style={{ 
            height: 100,
            objectFit: 'cover',
            borderRadius: 8,
            border: '1px solid #f0f0f0',
          }}
          preview={{ 
            src: url,
            mask: '预览',
          }}
        />
      ),
    },
    {
      title: '菜名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '英文名',
      dataIndex: 'nameEn',
      width: 120,
    },
    {
      title: '热量等级',
      dataIndex: 'heat',
      render: (value: number) => heatList.find((item) => item.value === value)?.label,
    },
    {
      title: '类型',
      dataIndex: 'types',
      width: 200,
      render: (value: number[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {foodList
            .filter((item) => value?.includes(item.value))
            .map((item) => (
              <Tag key={item.value} color="blue">{item.label}</Tag>
            ))}
        </div>
      ),
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '每份含量',
      dataIndex: 'content',
      width: 200,
      render: (_: any, item: any) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Tag color="magenta">卡路里：{item.caloriesPerUnit}</Tag>
          <Tag color="green">蛋白质：{item.carbsPerUnit}</Tag>
          <Tag color="gold">脂肪：{item.fatPerUnit}</Tag>
          <Tag color="blue">碳水：{item.proteinPerUnit}</Tag>
        </div>
      ),
    },
    {
      title: '每100克含量',
      dataIndex: 'unit',
      width: 200,
      render: (_: any, item: any) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Tag color="magenta">卡路里：{item.caloriesPer100gram}</Tag>
          <Tag color="green">蛋白质：{item.carbsPer100gram}</Tag>
          <Tag color="gold">脂肪：{item.fatPer100gram}</Tag>
          <Tag color="blue">碳水：{item.proteinPer100gram}</Tag>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      className: 'action-cell',
      render: (_: any, item: any) => (
        <Space size="middle">
          <span 
            onClick={() => onModify(item)} 
            className="action-link"
          >
            修改
          </span>
          <span 
            onClick={() => onDelete(item.id)} 
            className="action-link danger"
          >
            删除
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
          
          actions: {
            primary: {
              label: '新增菜品',
              onClick: () => setCreateFlag(true),
            },
          },
          filter: (
            <Filter submit={handleFilter}>
              <Query />
            </Filter>
          ),
        }}
      />
      <FoodCreate
        visible={createFlag}
        onCancel={() => setCreateFlag(false)}
        onRefresh={refresh}
      />
      <FoodModify
        visible={modifyFlag}
        data={modifyItem}
        onCancel={() => setModifyFlag(false)}
        onRefresh={refresh}
      />
    </div>
  );
};

export default FoodListTemplate;
