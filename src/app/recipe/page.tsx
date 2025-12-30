'use client';
import React, { FC, Suspense, useCallback, useEffect, useState } from 'react';
import { Space, Tag, message,Image } from 'antd';
import Query from './query';
import Filter from '@/components/form/filter';
import FoodCreate from './createRecipe';
import FoodModify from './modify';
import { recipeMealItemDelete, recipeMealItemPage } from '@/network/api';
import PaginatedTable from '@/components/paginatedTable';
import { useRouter, useSearchParams } from 'next/navigation';
import { mealTypeList } from './config';
import FoodCoverCreate from './createCover';



const RecipeContent: FC = () => {
  const searchParams = useSearchParams();
  const recipeSetId = parseInt(searchParams.get('id') as string);
  const router = useRouter();
  
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
      const res = await recipeMealItemPage({
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
      setTotal(res.total || 0);
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
    await recipeMealItemDelete({ id });
    refresh();
  }, [refresh]);


  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
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
      title: '图片',
      dataIndex: 'foodImageUrl',
      width: 120,
      render: (url: string, item: any) => {
        const imageUrl = url || item.previewPhoto;
        return (
          <Image
            src={imageUrl}
            alt="食谱图片"
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
      title: '份',
      dataIndex: 'quantity',
    },
    {
      title: '每份含量',
      dataIndex: 'content',
      width: 200,
      render: (_: any, item: any) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
          header: {
            title: '食谱详情管理',
            description: '管理食谱计划中的具体食谱内容，包括早中晚餐安排',
          },
          actions: {
            primary: {
              label: '新增食谱',
              onClick: () => setCreateFlag(true),
            },
            secondary: [
              {
                label: '查看封面总览',
                onClick: () => {
                  if (!Number.isNaN(recipeSetId)) {
                    // 使用当前 recipeSetId 跳转到封面总览页
                    router.push(`/recipe/mealCover?id=${recipeSetId}`);
                  }
                },
              },
              {
                label: '生成早中晚餐封面',
                onClick: () => setCreateCoverFlag(true),
              },
            ],
          },
          filter: (
            <Filter submit={handleFilter}>
              <Query />
            </Filter>
          ),
        }}
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
    </div>
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
