'use client'
import FormItem from "@/components/form/item";
import {Input, Select} from "antd";
import React from "react";

const Query=()=>{
    return <>
        <FormItem span={6} label={"食谱名"} name="name" >
            <Input/>
        </FormItem>

    </>
}
export default Query
