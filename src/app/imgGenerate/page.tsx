'use client';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Drawer, Space, Tag, Image, message, Select } from 'antd';

import TextArea from 'antd/es/input/TextArea';
import { imgGenerate } from '@/network/api';
import { img_url } from '@/network';

const options = [{label:"1280*720",value:"1280*720"},{label:"1024×1024",value:"1024×1024"}]
const FoodListTemplate: FC = () => {
  const [size,setSize]=useState<String>('')
  const [promote,setPromote]=useState<String>('')
  const [img,setImg]=useState<String>('')

  const fetchData = useCallback(async () => {
    try {
      const res = await imgGenerate({
        size,promote
      });
      console.log(res);
      
      setImg(res);
      
    } catch (e) {
      message.error('获取数据失败');
    } finally {
    }
  }, [size,promote]);

  

  return (
      <div className="flex flex-col mb-4">
        <div className='mt-10'>
        提示词：
        <TextArea onChange={(e)=>setPromote(e.target.value)} style={{height:300}}></TextArea>
        </div>

        <div className='my-10'>
          图片大小：
          <Select options={options} onChange={(value)=>setSize(value)} style={{width:200}}></Select>
        </div>

        <Button type="primary" onClick={() => fetchData()} className="mr-5 mb-10">
          生成食谱图片
        </Button>
        {img && <Image src={img_url + img} style={{width:600}}/>}
      </div>

  );
};

export default FoodListTemplate;
