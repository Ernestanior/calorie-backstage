'use client'
import React, { FC } from "react";
import { Drawer, Descriptions, Tag, Space } from "antd";
import type { DescriptionsProps } from 'antd';

interface IProps {
  visible: boolean;
  data: any;
  onCancel: () => void;
}

const UserDetail: FC<IProps> = ({ visible, data, onCancel }) => {
  if (!data) return null;

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    // 处理 "2025-12-02 18:32:20" 格式
    const dateStr = date.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, '$1T$2');
    try {
      return new Date(dateStr).toLocaleString('zh-CN');
    } catch (e) {
      return date;
    }
  };

  const genderMap: { [key: number]: string } = {
    1: '男',
    2: '女',
  };

  const langMap: { [key: string]: string } = {
    'zh_CN': '中文',
    'en_US': '英文',
    'ja_JP': '日语',
    'th_TH': '泰语',
    'ko_KR': '韩语',
    'fr_FR': '法语',
  };

  const items: DescriptionsProps['items'] = [
    { label: 'ID', children: data.id || '-' },
    { label: '设备ID', children: data.deviceId || '-' },
    { 
      label: '年龄', 
      children: data.age !== undefined && data.age !== null ? data.age : '-' 
    },
    { 
      label: '性别', 
      children: data.gender !== undefined && data.gender !== null 
        ? (genderMap[data.gender] || data.gender) 
        : '-' 
    },
    { 
      label: '语言', 
      children: data.lang ? (langMap[data.lang] || data.lang) : '-' 
    },
    { 
      label: '身高 (cm)', 
      children: data.height !== undefined && data.height !== null ? data.height : '-' 
    },
    { 
      label: '目标步数', 
      children: data.targetStep !== undefined && data.targetStep !== null ? data.targetStep : '-' 
    },
    { 
      label: '是否删除', 
      children: data.deleted ? <Tag color="red">是</Tag> : <Tag color="green">否</Tag> 
    },
    { 
      label: '首次打开', 
      children: data.firstOpen ? <Tag color="green">是</Tag> : <Tag>否</Tag> 
    },
    { 
      label: 'VIP状态', 
      children: data.vipStatus !== undefined && data.vipStatus !== null 
        ? (data.vipStatus ? <Tag color="gold">VIP</Tag> : <Tag>普通用户</Tag>)
        : '-' 
    },
    { 
      label: '自动续费', 
      children: data.autoRenew ? <Tag color="green">是</Tag> : <Tag>否</Tag> 
    },
    { 
      label: '首次试用', 
      children: data.firstTry ? <Tag color="green">是</Tag> : <Tag>否</Tag> 
    },
    { 
      label: '过期时间', 
      children: data.expireDateTime ? formatDate(data.expireDateTime) : '-' 
    },
    { 
      label: '能量', 
      children: data.energy !== undefined && data.energy !== null ? data.energy : '-' 
    },
    { 
      label: '积分', 
      children: data.point !== undefined && data.point !== null ? data.point : '-' 
    },
    { 
      label: '创建日期', 
      children: data.createDate ? formatDate(data.createDate) : '-' 
    },
  ];

  return (
    <Drawer 
      title="用户详情" 
      width={720} 
      onClose={onCancel} 
      open={visible}
      placement="right"
    >
      <Descriptions 
        items={items} 
        column={1}
        bordered
        labelStyle={{ 
          width: '150px',
          fontWeight: 500,
          backgroundColor: '#fafafa'
        }}
      />
    </Drawer>
  );
};

export default UserDetail;

