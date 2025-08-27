'use client'
import React, { FC, useState } from "react";
import { Button, Drawer, Form, InputNumber, Select, UploadFile } from "antd";
import { fileUpload, recipeCreate } from "@/network/api";
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
    const [image,setImage] = useState<UploadFile[]>([])

    const [errorMsg, setErrMsg] = useState<string>('')

    const onSubmit = async () => {
        const newData = form.getFieldsValue()
        const { day,mealType} = newData
        if ( !day || !mealType || !image.length) {
            setErrMsg('* 请填写完整')
            return
        } else {
            setErrMsg('')
        }
        const imgFormData = new FormData()
        image.forEach(img => {
            imgFormData.append('file', img.originFileObj as RcFile);
        });
        const previewPhoto = await fileUpload(imgFormData as any);
        
        const params = {
            ...newData,
            previewPhoto,recipeSetId,type:2
          }
        const res = await recipeCreate(params)
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
                <div className="flex flex-row mb-5">
                    <div className="text-sm mr-5">修改图片</div>
                    <ImageUpload changePic={setImage} maxCount={1} ></ImageUpload>
                </div>
                <div className="text-red-500 m-1">{errorMsg}</div>
                <Button onClick={onSubmit} type="primary" size='large'>提交</Button>
            </Form>
        </Drawer>
    );
};


export default FoodCoverCreate;

