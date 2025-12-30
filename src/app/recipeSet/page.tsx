'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Space, Tag, message,Image } from 'antd';
import Query from './query';
import Filter from '@/components/form/filter';
import FoodCreate from './create';
import { recipeSetDelete, recipeSetPage } from '@/network/api';
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
      const content = res?.content || res?.data?.content || [];
      const total =
        typeof res?.total === 'number'
          ? res.total
          : typeof res?.data?.total === 'number'
          ? res.data.total
          : res?.totalElements || 0;

      // 后端现在返回的是 label/labelEn 数组，这里映射成现有表格使用的 labelList/labelEnList 字段
      const mapped = content.map((item: any) => ({
        ...item,
        labelList: item.label ?? item.labelList,
        labelEnList: item.labelEn ?? item.labelEnList,
      }));

      setData(mapped);
      setTotal(total);
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
      title: '预览图',
      dataIndex: 'previewPhoto',
      width: 120,
      render: (url: string) => (
        <Image
          src={url}
          alt="食谱预览图"
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
      width: 200,
      render: (value: any) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {value && value.map((item: String, index: number) => (
            <Tag key={index} color="purple">{item}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'labelList',
      width: 200,
      render: (value: any) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {value && value.map((item: String, index: number) => (
            <Tag key={index} color="cyan">{item}</Tag>
          ))}
        </div>
      ),
    },

    
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      className: 'action-cell',
      render: (_: any, item: any) => (
        <Space size="middle">
          <span 
            onClick={() => onDetail(item.id)} 
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
              label: '新增食谱计划',
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
    </div>
  );
};

export default RecipeSet;
