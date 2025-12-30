'use client'
import React, { FC, useEffect, useState } from "react";
import { Button, Drawer, Form, Input, InputNumber, Select, Switch, message } from "antd";
import { userModify } from "@/network/api";
import { useForm } from "antd/es/form/Form";

interface IProps {
  data: any;
  visible: boolean;
  onCancel: () => void;
  onRefresh: () => void;
}

const langOptions = [
  { value: 'zh_CN', label: '中文' },
  { value: 'en_US', label: '英文' },
  { value: 'ja_JP', label: '日语' },
  { value: 'th_TH', label: '泰语' },
  { value: 'ko_KR', label: '韩语' },
  { value: 'fr_FR', label: '法语' },
];

const targetTypeOptions = [
  { value: 0, label: '减重' },
  { value: 1, label: '维持当前' },
  { value: 2, label: '增重' },
];

const UserModify: FC<IProps> = ({ data, visible, onRefresh, onCancel }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && visible) {
      form.setFieldsValue({
        ...data,
        gender: data.gender || undefined,
        firstOpen: data.firstOpen === 1 || data.firstOpen === true,
        autoRenew: data.autoRenew === 1 || data.autoRenew === true,
      });
    }
  }, [form, data, visible]);

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 转换布尔值
      const submitData = {
        ...values,
        id: data.id,
        firstOpen: values.firstOpen ? 1 : 0,
        autoRenew: values.autoRenew ? 1 : 0,
      };

      await userModify(submitData);
      message.success('修改成功');
      onCancel();
      onRefresh();
    } catch (error: any) {
      if (error?.errorFields) {
        message.error('请填写完整信息');
      } else {
        message.error('修改失败');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer 
      title="修改用户" 
      width={600} 
      onClose={onCancel} 
      open={visible}
      placement="right"
      footer={
        <div style={{ textAlign: 'right', padding: '10px 0' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={onSubmit} type="primary" loading={loading}>
            确认修改
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          name="currentWeight" 
          label="当前体重 (kg)"
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder="请输入当前体重"
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item 
          name="targetWeight" 
          label="目标体重 (kg)"
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder="请输入目标体重"
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item 
          name="height" 
          label="身高 (cm)"
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder="请输入身高"
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item 
          name="initWeight" 
          label="初始体重 (kg)"
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder="请输入初始体重"
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item 
          name="age" 
          label="年龄"
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder="请输入年龄"
            min={0}
            max={150}
          />
        </Form.Item>

        <Form.Item 
          name="activityFactor" 
          label="活动系数"
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder="请输入活动系数"
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item 
          name="weeklyWeightChange" 
          label="每周体重变化 (kg)"
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder="请输入每周体重变化"
            precision={2}
          />
        </Form.Item>

        <Form.Item 
          name="gender" 
          label="性别"
        >
          <Select
            style={{ width: '100%' }}
            placeholder="请选择性别"
            allowClear
            options={[
              { value: 1, label: '男' },
              { value: 2, label: '女' },
            ]}
          />
        </Form.Item>

        <Form.Item 
          name="firstOpen" 
          label="首次打开"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item 
          name="autoRenew" 
          label="自动续费"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item 
          name="lang" 
          label="语言"
        >
          <Select
            style={{ width: '100%' }}
            placeholder="请选择语言"
            allowClear
            options={langOptions}
          />
        </Form.Item>

        <Form.Item 
          name="phone" 
          label="手机号"
        >
          <Input 
            placeholder="请输入手机号"
          />
        </Form.Item>

        <Form.Item 
          name="targetType" 
          label="目标类型"
        >
          <Select
            style={{ width: '100%' }}
            placeholder="请选择目标类型"
            allowClear
            options={targetTypeOptions}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default UserModify;

