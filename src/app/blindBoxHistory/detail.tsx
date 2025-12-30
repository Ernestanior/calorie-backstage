'use client'
import React, { FC } from "react";
import { Drawer, Descriptions, Tag, Space, Image, Collapse } from "antd";
import type { DescriptionsProps } from 'antd';

const { Panel } = Collapse;

interface IProps {
  visible: boolean;
  data: any;
  onCancel: () => void;
}

const BlindBoxHistoryDetail: FC<IProps> = ({ visible, data, onCancel }) => {
  if (!data) return null;

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    // 处理 "2025-11-24 11:25:16" 格式
    const dateStr = date.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2');
    try {
      return new Date(dateStr).toLocaleString('zh-CN');
    } catch (e) {
      return date;
    }
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

  const responseDto = data.responseDto || {};

  const baseItems: DescriptionsProps['items'] = [
    { label: 'ID', children: data.id || '-' },
    { label: '用户ID', children: data.userId !== undefined && data.userId !== null ? data.userId : '-' },
    { label: '类型', children: data.type ? typeMap[data.type] || data.type : '-' },
    { label: '餐类', children: data.mealType ? mealTypeMap[data.mealType] || data.mealType : '-' },
    { label: '餐名', children: data.mealName || '-' },
    { 
      label: '食材列表', 
      children: data.ingredientList?.length ? (
        <Space wrap>
          {data.ingredientList.map((item: string, index: number) => (
            <Tag key={index}>{item}</Tag>
          ))}
        </Space>
      ) : '-' 
    },
    { label: '提示词', children: data.prompt || '-' },
    { label: '创建日期', children: formatDate(data.createDate) },
    { label: '创建者', children: data.createBy || '-' },
  ];

  return (
    <Drawer 
      title="盲盒历史详情" 
      width={900} 
      onClose={onCancel} 
      open={visible}
      placement="right"
    >
      <Descriptions 
        items={baseItems} 
        column={1}
        bordered
        labelStyle={{ 
          width: '150px',
          fontWeight: 500,
          backgroundColor: '#fafafa'
        }}
      />
      
      {responseDto && (responseDto.imageUrl || responseDto.locale || responseDto.nutritionAnalysis) && (
        <div style={{ marginTop: 24 }}>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="生成的食谱详情" key="1">
              <Descriptions 
                items={[
                  { 
                    label: '图片', 
                    children: responseDto.imageUrl ? (
                      <Image
                        src={responseDto.imageUrl.startsWith('http') ? responseDto.imageUrl : responseDto.imageUrl}
                        alt={data.mealName || '食谱图片'}
                        width={200}
                        height={200}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                        preview={{ 
                          src: responseDto.imageUrl.startsWith('http') ? responseDto.imageUrl : responseDto.imageUrl 
                        }}
                      />
                    ) : '-'
                  },
                  { label: '语言', children: responseDto.locale || '-' },
                ]} 
                column={1}
                bordered
                labelStyle={{ 
                  width: '150px',
                  fontWeight: 500,
                  backgroundColor: '#fafafa'
                }}
              />

              {responseDto.nutritionAnalysis && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ marginBottom: 16 }}>营养分析</h3>
                  <Descriptions 
                    items={[
                      { label: '热量（卡路里）', children: responseDto.nutritionAnalysis.nutrition?.calories !== undefined && responseDto.nutritionAnalysis.nutrition?.calories !== null ? responseDto.nutritionAnalysis.nutrition.calories : '-' },
                      { label: '蛋白质（g）', children: responseDto.nutritionAnalysis.nutrition?.protein !== undefined && responseDto.nutritionAnalysis.nutrition?.protein !== null ? responseDto.nutritionAnalysis.nutrition.protein : '-' },
                      { label: '碳水（g）', children: responseDto.nutritionAnalysis.nutrition?.carbs !== undefined && responseDto.nutritionAnalysis.nutrition?.carbs !== null ? responseDto.nutritionAnalysis.nutrition.carbs : '-' },
                      { label: '脂肪（g）', children: responseDto.nutritionAnalysis.nutrition?.fat !== undefined && responseDto.nutritionAnalysis.nutrition?.fat !== null ? responseDto.nutritionAnalysis.nutrition.fat : '-' },
                      { label: '纤维（g）', children: responseDto.nutritionAnalysis.nutrition?.fiber !== undefined && responseDto.nutritionAnalysis.nutrition?.fiber !== null ? responseDto.nutritionAnalysis.nutrition.fiber : '-' },
                      { label: '钠（mg）', children: responseDto.nutritionAnalysis.nutrition?.sodium !== undefined && responseDto.nutritionAnalysis.nutrition?.sodium !== null ? responseDto.nutritionAnalysis.nutrition.sodium : '-' },
                      { label: '糖（g）', children: responseDto.nutritionAnalysis.nutrition?.sugar !== undefined && responseDto.nutritionAnalysis.nutrition?.sugar !== null ? responseDto.nutritionAnalysis.nutrition.sugar : '-' },
                      { label: '健康评分', children: responseDto.nutritionAnalysis.healthScore !== undefined && responseDto.nutritionAnalysis.healthScore !== null ? responseDto.nutritionAnalysis.healthScore : '-' },
                      { label: '份量', children: responseDto.nutritionAnalysis.servingSize || '-' },
                      { 
                        label: '平衡建议', 
                        children: responseDto.nutritionAnalysis.balanceAdvice?.length ? (
                          <Space direction="vertical" size="small">
                            {responseDto.nutritionAnalysis.balanceAdvice.map((advice: string, index: number) => (
                              <div key={index}>• {advice}</div>
                            ))}
                          </Space>
                        ) : '-'
                      },
                      { 
                        label: '饮食标签', 
                        children: responseDto.nutritionAnalysis.dietaryTags?.length ? (
                          <Space wrap>
                            {responseDto.nutritionAnalysis.dietaryTags.map((tag: string, index: number) => (
                              <Tag key={index} color="blue">{tag}</Tag>
                            ))}
                          </Space>
                        ) : '-'
                      },
                    ]} 
                    column={1}
                    bordered
                    labelStyle={{ 
                      width: '150px',
                      fontWeight: 500,
                      backgroundColor: '#fafafa'
                    }}
                  />
                </div>
              )}
            </Panel>
          </Collapse>
        </div>
      )}
    </Drawer>
  );
};

export default BlindBoxHistoryDetail;

