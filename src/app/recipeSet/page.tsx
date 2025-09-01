'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Space, Tag, message,Image } from 'antd';
import Query from './query';
import Filter from '@/components/form/filter';
import FoodCreate from './create';
import { recipeSetDelete, recipeSetPage } from '@/network/api';
import { img_url } from '@/network';
import PaginatedTable from '@/components/paginatedTable';
import { weightList } from './config';
import { useRouter } from 'next/navigation';
import RecipeSetModify from './modify';
import RecipeSetCreate from './create';

const RecipeSet: FC = () => {
  const router = useRouter();
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
      const res = await recipeSetPage({
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

  const onDelete = useCallback(async (id: number) => {
    await recipeSetDelete({ id });
    refresh();
  },[]);

  const onDetail=useCallback((id:number)=>{
    router.push(`/recipe?id=${id}`);
  },[])

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '菜谱名',
      dataIndex: 'name',
    },
    {
      title: '英文名',
      dataIndex: 'nameEn',
    },
    {
      title: '图',
      dataIndex: 'previewPhoto',
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
      title: '隐藏/显示',
      dataIndex: 'visible',
      render: (value: any) => value==1?"显示":"隐藏"

    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (value: any) => value==1?"减重":"增重"

    },
    {
      title: '颜色',
      dataIndex: 'color',
    },
    {
      title: '重量',
      dataIndex: 'weight',
      render: (value: any) => {
        if (value) {
          return weightList[value]['label']
        }else
          return weightList[0]['label']
      } 

    },
    {
      title: '热度',
      dataIndex: 'hot',
    },
    {
      title: '计划时长',
      dataIndex: 'day',
      render: (value: any) => <span>{value}天</span>
    },
    {
      title: '英文标签',
      dataIndex: 'labelEnList',
      render: (value: any) => value && value.map((item:String)=><Tag>{item}</Tag>)
    },
    {
      title: '标签',
      dataIndex: 'labelList',
      render: (value: any) => value && value.map((item:String)=><Tag>{item}</Tag>)
    },

    
    {
      title: '操作',
      key: 'action',
      render: (_: any, item: any) => (
        <Space size="middle">
          <div onClick={() => onDetail(item.id)} className="text-blue-500 cursor-pointer">
            详情
          </div>
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

      <RecipeSetCreate
        visible={createFlag}
        onCancel={() => setCreateFlag(false)}
        onRefresh={refresh}
      />
      <RecipeSetModify
        visible={modifyFlag}
        data={modifyItem}
        onCancel={() => setModifyFlag(false)}
        onRefresh={refresh}
      />
    </section>
  );
};

export default RecipeSet;
