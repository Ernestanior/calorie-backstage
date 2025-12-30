'use client';

import React, { FC, useEffect, useMemo, useState } from 'react';
import { Card, Col, Empty, Image, Row, Spin, Tag } from 'antd';
import { useSearchParams } from 'next/navigation';
import { recipeMealItemPage } from '@/network/api';
import { mealTypeList } from './config';

interface MealCoverItem {
  day: number;
  mealType: number;
  coverUrl?: string;
}

const MealCoverPage: FC = () => {
  const searchParams = useSearchParams();
  const recipeSetIdParam = searchParams.get('id');
  const recipeSetId = recipeSetIdParam ? parseInt(recipeSetIdParam, 10) : NaN;

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!recipeSetId || Number.isNaN(recipeSetId)) return;

    const fetchAllItems = async () => {
      setLoading(true);
      try {
        // 简单处理：取一个较大的 pageSize，当前数据量足够
        const res = await recipeMealItemPage({
          recipeSetId,
          searchPage: {
            page: 1,
            pageSize: 500,
            desc: 0,
            sort: '',
          },
        });
        setItems(res.content || []);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, [recipeSetId]);

  const mealCovers: MealCoverItem[] = useMemo(() => {
    const map = new Map<string, MealCoverItem & { hasPreview: boolean }>();

    items.forEach((item: any) => {
      const day: number = item.day;
      const mealType: number = item.mealType;
      const key = `${day}-${mealType}`;

      const existing = map.get(key) || { day, mealType, coverUrl: undefined, hasPreview: false };

      // 优先使用 meal 的 previewPhoto（cover）
      const previewPhoto: string | undefined = item.previewPhoto;
      const foodImageUrl: string | undefined = item.foodImageUrl;

      if (!existing.hasPreview && previewPhoto) {
        existing.coverUrl = previewPhoto;
        existing.hasPreview = true;
      } else if (!existing.coverUrl && foodImageUrl) {
        // 退而求其次，用某个食材图
        existing.coverUrl = foodImageUrl;
      }

      map.set(key, existing);
    });

    return Array.from(map.values()).map(({ hasPreview, ...rest }) => rest);
  }, [items]);

  const mealTypeLabel = (value: number) => {
    const mt = mealTypeList.find((m) => m.value === value);
    return mt?.label ?? value;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">食谱计划封面总览</h2>
      <p className="text-gray-500 mb-4">按天和早/中/晚查看当前食谱计划中每一顿的封面图。</p>

      {!recipeSetId || Number.isNaN(recipeSetId) && (
        <div className="mb-4 text-red-500">URL 中缺少有效的 recipeSetId 参数，例如：/recipe/mealCover?id=3</div>
      )}

      <Spin spinning={loading}>
        {mealCovers.length === 0 ? (
          <Empty description="暂无封面数据" />
        ) : (
          <Row gutter={[16, 16]}>
            {mealCovers.map((meal) => (
              <Col key={`${meal.day}-${meal.mealType}`} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  size="small"
                  title={
                    <div className="flex items-center justify-between">
                      <span>第 {meal.day} 天</span>
                      <Tag color={mealTypeList.find((m) => m.value === meal.mealType)?.color || 'blue'}>
                        {mealTypeLabel(meal.mealType)}
                      </Tag>
                    </div>
                  }
                >
                  {meal.coverUrl ? (
                    <Image
                      src={meal.coverUrl}
                      alt="封面图"
                      width="100%"
                      style={{ height: 160, objectFit: 'cover', borderRadius: 8 }}
                      preview={{ src: meal.coverUrl, mask: '预览' }}
                    />
                  ) : (
                    <div className="h-40 flex items-center justify-center border border-dashed rounded-md text-gray-400 text-sm">
                      暂无封面图
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default MealCoverPage;
