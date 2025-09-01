'use client';
import React, { FC, Suspense, useCallback, useEffect, useState } from 'react';
import { Button, Space, Tag, message,Image } from 'antd';
import Query from './query';
import Filter from '@/components/form/filter';
import FoodCreate from './createRecipe';
import FoodModify from './modify';
import { recipeDelete, recipePage } from '@/network/api';
import PaginatedTable from '@/components/paginatedTable';
import { img_url } from '@/network';
import { useRouter, useSearchParams } from 'next/navigation';
import { mealTypeList } from './config';
import FoodCoverCreate from './createCover';



const RecipeContent: FC = () => {
  const searchParams = useSearchParams();
  const recipeSetId = parseInt(searchParams.get('id') as string);
  
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState({});
  const [createFlag, setCreateFlag] = useState(false);
  const [createCoverFlag, setCreateCoverFlag] = useState(false);
  const [modifyFlag, setModifyFlag] = useState(false);
  const [modifyItem, setModifyItem] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await recipePage({
        ...queryParams,
        recipeSetId,
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
    await recipeDelete({ id });
    refresh();
  },[]);


  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: 'type',
      dataIndex: 'type',
      render:(value:any)=>value===1?<Tag color={'red'}>菜谱</Tag>:<Tag color={'orange'}>封面</Tag>
    },
    {
      title: '计划id',
      dataIndex: 'recipeSetId',
    },
    {
      title: '第几天',
      dataIndex: 'day',

    },
    {
      title: '早/中/晚餐',
      dataIndex: 'mealType',
      render: (value: number) => {
        const meals = mealTypeList.find(item=>item.value===value)
        return <Tag color={meals?.color}>{meals?.label}</Tag>
      }
    },
    {
      title: '食谱',
      dataIndex: 'foodNutritionId',
      render: (_: any, item: any) => (
        <div className="flex flex-col">
          {item.foodNutritionId} - {item.foodName}
        </div>
      ),
    },

    {
      title: '图',
      dataIndex: 'foodImageUrl',
      width: 150,
      render: (url: string,item:any) => {
        if (url) {
          return <Image
        src={img_url + url}
        alt=""
        width={150}
        style={{ height: 'auto' }}
        preview={{ src: img_url + url }}
      />
        }else{
          return <Image
          src={img_url + item.previewPhoto}
          alt=""
          width={150}
          style={{ height: 'auto' }}
          preview={{ src: img_url + item.previewPhoto}}
        />
        }
        
      }
        
    },
    {
      title: '份',
      dataIndex: 'quantity',
    },
    {
      title: '每份含量',
      dataIndex: 'content',
      render: (_: any, item: any) => (
        <div className="flex flex-col">
          <Tag color="magenta">卡路里：{item.foodCaloriesPerUnit}</Tag>
          <Tag color="green">蛋白质：{item.foodCarbsPerUnit}</Tag>
          <Tag color="gold">脂肪：{item.foodFatPerUnit}</Tag>
          <Tag color="blue">碳水：{item.foodProteinPerUnit}</Tag>
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
        <Button type="primary" onClick={() => setCreateCoverFlag(true)} className="mr-5">
          生成早中晚餐封面
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
        recipeSetId={recipeSetId}
        visible={createFlag}
        onCancel={() => setCreateFlag(false)}
        onRefresh={refresh}
      />
      <FoodCoverCreate
        recipeSetId={recipeSetId}
        visible={createCoverFlag}
        onCancel={() => setCreateCoverFlag(false)}
        onRefresh={refresh}
      />
      <FoodModify
        recipeSetId={recipeSetId}
        visible={modifyFlag}
        data={modifyItem}
        onCancel={() => setModifyFlag(false)}
        onRefresh={refresh}
      />
    </section>
  );
};

const Recipe: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecipeContent />
    </Suspense>
  );
};

export default Recipe;
