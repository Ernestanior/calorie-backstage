'use client'
import React, { FC, useState } from "react";
import { Button, Drawer, Form, InputNumber, Select } from "antd";
import { recipeCreate } from "@/network/api";
import { useForm } from "antd/es/form/Form";
import { mealTypeList } from "./config";

interface IProps {
    visible: boolean;
    onCancel: any;
    onRefresh: any;
    recipeSetId:number;
}

const FoodCreate: FC<IProps> = ({ recipeSetId,visible, onRefresh, onCancel }) => {
    const [form] = useForm()

    const [errorMsg, setErrMsg] = useState<string>('')

    const onSubmit = async () => {
        const newData = form.getFieldsValue()
        const { day,mealType,foodNutritionId,quantity} = newData
        if ( !day || !mealType || !foodNutritionId || !quantity) {
            setErrMsg('* 请填写完整')
            return
        } else {
            setErrMsg('')
        }
        const res = await recipeCreate({...newData,recipeSetId,type:1})
        console.log(res);
        onCancel()
        onRefresh()
    }

    return (
        <Drawer title="修改食谱" width={900} onClose={onCancel} open={visible}>
            <Form form={form} initialValues={{quantity:1,mealType:1}}>
                <Form.Item name={'day'} label="第几天" required>
                    <InputNumber min={1} max={30} style={{ width: 200 }} />
                </Form.Item>
                <Form.Item name={'mealType'} label="早/中/晚餐" required>
                    <Select options={mealTypeList} style={{ width: 200 }}/>
                </Form.Item>

                <Form.Item name={'foodNutritionId'} label="菜谱id" required>
                    <InputNumber min={1} style={{ width: 200 }} />
                </Form.Item>
                <Form.Item name={'quantity'} label="数量" required>
                    <InputNumber min={1} style={{ width: 200 }} />
                </Form.Item>
                <div className="text-red-500 m-1">{errorMsg}</div>
                <Button onClick={onSubmit} type="primary" size='large'>提交</Button>
            </Form>
        </Drawer>
    );
};


export default FoodCreate;

