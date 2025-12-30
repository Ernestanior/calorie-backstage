'use client'
import React, {FC, useEffect, useState} from "react";
import { Button, Drawer, Form, Input, InputNumber, Select, Table, Tag, UploadFile } from "antd";
import { fileUpload, foodCreate, foodModify, foodPage } from "@/network/api";
import {useForm} from "antd/es/form/Form";
import ImageUpload from "@/components/ImageUpload";
import { foodList, heatList, UnitList } from "./config";
import { RcFile } from "antd/es/upload";
import Image from "next/image";

interface IProps{
    data:any;
    visible:boolean;
    onCancel:any;
    onRefresh:any;
}

const FoodModify: FC<IProps> = ({data,visible,onRefresh,onCancel}) => {
    const [form] = useForm()
    const [image,setImage] = useState<UploadFile[]>([])
    const [errorMsg,setErrMsg]=useState<string>('')

    useEffect(()=>{
        if(data){
            // 后端返回字段为 `type`，表单字段为 `types`，这里做一次映射
            form.setFieldsValue({
                ...data,
                types: (data as any).type ?? (data as any).types,
            })
        }
        else{
            form.setFieldsValue({status:""})
        }
    },[form,data])

    const onSubmit=async()=>{
        const newData = form.getFieldsValue()
        const {name,types,heat}=newData
        // 修改时不强制要求重新上传图片，只校验必填的基础字段
        if(!name || !types || !heat){
            setErrMsg('* 请填写完整')
            return 
        }else{
            setErrMsg('')
        }
        let params
        if (image.length) {
            const imgFormData = new FormData()
            image.forEach(img => {
                imgFormData.append('file', img.originFileObj as RcFile);
            });
            const imageUrl = await fileUpload(imgFormData as any);
            params = {
                id:data.id,
                ...newData,
                imageUrl
              }
        }else{
            params = {
                id:data.id,
                ...newData,
              }
        }
        const res = await foodModify(params)
        console.log(res);
        
        onCancel()
        onRefresh()
    }

    return (
        <Drawer title="新增食谱" width={900} onClose={onCancel} open={visible}>
            <Form form={form} >
                <div className="flex flex-row mb-5 items-center">
                    <Form.Item name={'name'} label="菜名">
                        <Input style={{width:150,marginRight:50}}/>
                    </Form.Item>
                    <Form.Item name={'nameEn'} label="菜名英文" required>
                        <Input style={{width:150,marginRight:50}}/>
                    </Form.Item>
                    <Form.Item name={'types'} label="类型">
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: 400}}
                            placeholder="Please select"
                            options={foodList}
                        />
                    </Form.Item>
                </div>
                <div className="flex flex-row mb-5">
                    <Form.Item name={'heat'} label="热量">
                        <Select
                            style={{ width: 400}}
                            placeholder="Please select"
                            options={heatList}
                        />
                    </Form.Item>
                </div>
                
                <div className="flex flex-row mb-5 items-center" style={{marginTop:40}}>
                    <div className="text-sm font-bold"></div>
                    <Form.Item name={'unit'} label="每 一 ">
                        <Select
                            style={{marginLeft:8}}
                            defaultValue={"份"}
                            options={UnitList}
                        />
                    </Form.Item>
                </div>
                <div className="flex flex-row mb-5 items-center">
                    <Form.Item label="卡路里">
                        <Form.Item name={'caloriesPerUnit'} noStyle>
                            <InputNumber />
                        </Form.Item>
                        千卡
                    </Form.Item>
                    <Form.Item label="碳水">
                        <Form.Item name={'carbsPerUnit'} noStyle>
                            <InputNumber />
                        </Form.Item>
                        克
                    </Form.Item>
                    <Form.Item label="蛋白质">
                        <Form.Item name={'proteinPerUnit'} noStyle>
                            <InputNumber />
                        </Form.Item>
                        克
                    </Form.Item>
                    <Form.Item label="脂肪">
                        <Form.Item name={'fatPerUnit'} noStyle>
                            <InputNumber />
                        </Form.Item>
                        克
                    </Form.Item>
                </div>

                <div className="flex flex-row mb-5" style={{marginTop:40}}>
                    <div className="text-sm font-bold">每 100 克 </div>
                </div>
                <div className="flex flex-row mb-5 items-center">
                <Form.Item label="卡路里">
                        <Form.Item name={'caloriesPer100gram'} noStyle>
                            <InputNumber />
                        </Form.Item>
                        千卡
                    </Form.Item>
                    <Form.Item label="碳水">
                        <Form.Item name={'carbsPer100gram'} noStyle>
                            <InputNumber />
                        </Form.Item>
                        克
                    </Form.Item>
                    <Form.Item label="蛋白质">
                        <Form.Item name={'proteinPer100gram'} noStyle>
                            <InputNumber />
                        </Form.Item>
                        克
                    </Form.Item>
                    <Form.Item label="脂肪">
                        <Form.Item name={'fatPer100gram'} noStyle>
                            <InputNumber />
                        </Form.Item>
                        克
                    </Form.Item>
                </div>
                <div className="flex flex-row mb-5">
                    <Image alt="" src={data.imageUrl} width={100} height={100} />
                    <div className="text-sm font-bold ml-15 mr-5">修改图片</div>
                    <ImageUpload changePic={setImage} maxCount={1} ></ImageUpload>
                </div>
                <div className="text-red-500 m-1">{errorMsg}</div>
                <Button onClick={onSubmit} type="primary" size='large'>提交</Button>
            </Form>
        </Drawer>
    );
};


export default FoodModify;

