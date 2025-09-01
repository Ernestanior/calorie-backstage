'use client'
import React, { FC, useState } from "react";
import { Button, Drawer, Form, InputNumber, Select, UploadFile } from "antd";
import { fileUpload, recipeCreate, recipeRefreshCover } from "@/network/api";
import { useForm } from "antd/es/form/Form";
import { mealTypeList } from "./config";
import ImageUpload from "@/components/ImageUpload";
import { RcFile } from "antd/es/upload";

interface IProps {
    visible: boolean;
    onCancel: any;
    onRefresh: any;
    recipeSetId:number;
}

const FoodCoverCreate: FC<IProps> = ({ recipeSetId,visible, onRefresh, onCancel }) => {
    const [form] = useForm()

    const [errorMsg, setErrMsg] = useState<string>('')

    const onSubmit = async () => {
        const newData = form.getFieldsValue()
        const { day,mealType} = newData
        console.log(day,mealType);
        
        // if ( !day || !mealType) {
        //     setErrMsg('* 请填写完整')
        //     return
        // } else {
        //     setErrMsg('')
        // }

        let params:any = {
            recipeSetId
          }
          if (day) {
            params={...params,day}
          }
          if (mealType) {
            params={...params,mealType}
          }
          
        const res = await recipeRefreshCover(params)
        onCancel()
        onRefresh()
    }

    return (
        <Drawer title="修改食谱" width={900} onClose={onCancel} open={visible}>
            <Form form={form} initialValues={{mealType:0}}>
                <Form.Item name={'day'} label="第几天" required>
                    <InputNumber min={0} max={30} style={{ width: 200 }} />
                </Form.Item>
                <Form.Item name={'mealType'} label="早/中/晚餐" required>
                    <Select options={mealTypeList} style={{ width: 200 }}/>
                </Form.Item>

                <div className="text-red-500 m-1">{errorMsg}</div>
                <Button onClick={onSubmit} type="primary" size='large'>提交</Button>
            </Form>
        </Drawer>
    );
};


export default FoodCoverCreate;

