'use client'
import FormItem from "@/components/form/item";
import { Input, Select, DatePicker } from "antd";
import React from "react";

const mealTypeOptions = [
  { value: 1, label: '早餐' },
  { value: 2, label: '午餐' },
  { value: 3, label: '晚餐' },
];

const Query = () => {
  return (
    <>
      <FormItem span={6} label={"ID"} name="id">
        <Input type="number" placeholder="请输入ID" />
      </FormItem>
      <FormItem span={6} label={"用户ID"} name="userId">
        <Input type="number" placeholder="请输入用户ID" />
      </FormItem>
      <FormItem span={6} label={"餐类"} name="mealType">
        <Select allowClear placeholder="请选择餐类" options={mealTypeOptions} />
      </FormItem>
      <FormItem span={6} label={"餐名"} name="mealName">
        <Input placeholder="请输入餐名" />
      </FormItem>
      <FormItem span={6} label={"创建日期"} name="createDate">
        <DatePicker 
          placeholder="请选择创建日期" 
          style={{ width: '100%' }}
          format="YYYY-MM-DD"
        />
      </FormItem>
    </>
  );
};

export default Query;

