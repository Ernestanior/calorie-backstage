'use client'
import FormItem from "@/components/form/item";
import { Input } from "antd";
import React from "react";

const Query = () => {
  return (
    <>
      <FormItem span={6} label={"ID"} name="id">
        <Input type="number" placeholder="请输入ID" />
      </FormItem>
      <FormItem span={8} label={"设备ID"} name="deviceId">
        <Input placeholder="请输入设备ID" />
      </FormItem>
    </>
  );
};

export default Query;

