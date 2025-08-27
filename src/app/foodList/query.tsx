'use client'
import FormItem from "@/components/form/item";
import {Input, Select} from "antd";
import React from "react";
import { foodList, heatList } from "./config";

const Query=()=>{
    return <>
        <FormItem span={6} label={"菜名"} name="name" >
            <Input/>
        </FormItem>
        <FormItem span={8} label={"类型"} name="types">
            <Select allowClear mode="multiple" options={foodList}/>
        </FormItem>
        <FormItem span={7} label={"热量等级"} name="heat">
            <Select allowClear options={heatList}/>
        </FormItem>
    </>
}
export default Query
