'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Drawer, Space, Tag, Image, message } from 'antd';
import Query from './query';
import Filter from '@/components/form/filter';
import FoodCreate from './create';
import FoodModify from './modify';
import { foodDelete, foodPage } from '@/network/api';
import { foodList, heatList } from './config';
import { img_url } from '@/network';
import PaginatedTable from '@/components/paginatedTable';

const FoodListTemplate: FC = () => {
  const [data, setData] = useState([]);
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
      setData(res.content || []);
      setTotal(res.totalElements || 0);
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
        title: 'id',
        dataIndex: 'id',
        width: 120,
      },
    {
      title: '图',
      dataIndex: 'imageUrl',
      width: 150,
      render: (url: string) => (
        <Image
          src={img_url + url}
          alt=""
          width={150}
          style={{ height: 'auto' }}
          preview={{ src: img_url + url }}
        />
      ),
    },
    {
      title: '菜名',
      dataIndex: 'name',
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
      render: (value: number[]) =>
        foodList
          .filter((item) => value?.includes(item.value))
          .map((item) => <Tag key={item.value}>{item.label}</Tag>),
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '每份含量',
      dataIndex: 'content',
      render: (_: any, item: any) => (
        <div className="flex flex-col">
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
      render: (_: any, item: any) => (
        <div className="flex flex-col">
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
      render: (_: any, item: any) => (
        <Space size="middle">
          <div onClick={() => onModify(item)} className="text-blue-500 cursor-pointer">
            修改
          </div>
          <div onClick={() => onDelete(item.id)} className="text-blue-500 cursor-pointer">
            删除
          </div>
        </Space>
      ),
    },
  ];

  return (
    <section>
      <div className="flex mb-4">
        <Button type="primary" onClick={() => setCreateFlag(true)} className="mr-5">
          新增食谱
        </Button>
        <Filter submit={handleFilter}>
          <Query />
        </Filter>
      </div>

      <PaginatedTable
        columns={columns}
        data={data}
        total={total}
        current={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        loading={loading}
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
    </section>
  );
};

export default FoodListTemplate;
