'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Drawer, Space, Tag, Image, message, Select } from 'antd';

import TextArea from 'antd/es/input/TextArea';
import { imgGenerate } from '@/network/api';

const options = [
  { label: "1280*720", value: "1280*720" },
  { label: "1024*1024", value: "1024*1024" },
]
const FoodListTemplate: FC = () => {
  const [size, setSize] = useState<string>('')
  const [promote, setPromote] = useState<string>('')
  const [img, setImg] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await imgGenerate({
        size,
        promote,
      });
      console.log(res);
      
      setImg((res as any)?.url || '');
      
    } catch (e) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  }, [size,promote]);

  

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI 图片生成</h1>
        <p className="page-description">使用 AI 技术根据提示词生成食谱相关图片</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 8, 
            fontWeight: 500,
            color: 'var(--text-primary)',
            fontSize: 14,
          }}>
            提示词
          </label>
          <TextArea 
            onChange={(e) => setPromote(e.target.value)} 
            placeholder="请输入图片生成的提示词，例如：美味的意大利面，高清，美食摄影"
            style={{ 
              height: 200,
              borderRadius: 8,
            }}
            showCount
            maxLength={500}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: 'block', 
            marginBottom: 8, 
            fontWeight: 500,
            color: 'var(--text-primary)',
            fontSize: 14,
          }}>
            图片尺寸
          </label>
          <Select 
            options={options} 
            onChange={(value) => setSize(value)} 
            style={{ width: 200 }}
            placeholder="请选择图片尺寸"
          />
        </div>

        <Button 
          type="primary" 
          size="large"
          onClick={() => fetchData()} 
          loading={loading}
          disabled={!promote || !size}
          style={{
            height: 48,
            paddingLeft: 36,
            paddingRight: 36,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          生成图片
        </Button>
      </div>

      {img && (
        <div className="card">
          <h3 style={{ 
            marginBottom: 16, 
            fontSize: 16, 
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}>
            生成的图片
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: 24,
            background: '#fafafa',
            borderRadius: 8,
            border: '1px dashed #d9d9d9',
          }}>
            <Image 
              src={img} 
              style={{ 
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              preview={{
                mask: '预览',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodListTemplate;
