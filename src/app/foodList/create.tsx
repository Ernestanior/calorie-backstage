'use client'
import React, {FC, useCallback, useEffect, useState} from "react";
import Query from "./query";
import { init_url } from "@/network";
import { Button, Drawer, Form, Input, InputNumber, notification, Select, Table, Tag, UploadFile } from "antd";
import { fileUpload, foodCreate, foodPage } from "@/network/api";
import Filter from "@/components/form/filter";
import ImageUpload from "@/components/ImageUpload";
import { foodList, heatList, UnitList } from "./config";
import { RcFile } from "antd/es/upload";
import {useForm} from "antd/es/form/Form";

interface IProps{
    visible:boolean;
    onCancel:any;
    onRefresh:any;
}

const FoodCreate: FC<IProps> = ({visible,onRefresh,onCancel}) => {
    const [form] = useForm()

    const [image,setImage] = useState<UploadFile[]>([])
    const [errorMsg,setErrMsg]=useState<string>('')
    const onSubmit=async()=>{
        const newData = form.getFieldsValue()
        const {name,types,heat}=newData
        if(!name || !types || !heat || !image.length){
            setErrMsg('* 请填写完整')
            return 
        }else{
            setErrMsg('')
        }
        const imgFormData = new FormData()
        image.forEach(img => {
            imgFormData.append('file', img.originFileObj as RcFile);
        });
        const imageUrl = await fileUpload(imgFormData as any);
        
        const params = {
            ...newData,
            imageUrl
          }
        const res = await foodCreate(params)
        console.log(res);     
        onCancel()
        onRefresh()
    }

    return (
        <Drawer title="新增食谱" width={900} onClose={onCancel} open={visible}>
            <Form form={form} >
                <div className="flex flex-row mb-5 items-center">
                    <Form.Item name={'name'} label="菜名" required>
                        <Input style={{width:150,marginRight:50}}/>
                    </Form.Item>
                    <Form.Item name={'nameEn'} label="菜名英文" required>
                        <Input style={{width:150,marginRight:50}}/>
                    </Form.Item>
                    <Form.Item name={'types'} label="类型" required>
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
                    <Form.Item name={'heat'} label="热量" required>
                        <Select
                            style={{ width: 400}}
                            placeholder="Please select"
                            options={heatList}
                        />
                    </Form.Item>
                </div>
                
                <div className="flex flex-row mb-5 items-center" style={{marginTop:40}}>
                    <div className="text-sm font-bold"></div>
                    <Form.Item name={'unit'} label="每 一 " initialValue={"份"}>
                        <Select
                            style={{marginLeft:8}}
                            options={UnitList}
                        />
                    </Form.Item>
                </div>
                <div className="flex flex-row mb-5 items-center justify-around">
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

                <div className="flex flex-row mb-5">
                    <div className="text-sm">每 100 克 </div>
                </div>
                <div className="flex flex-row mb-5 items-center justify-around">
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
                    <div className="text-sm mr-5">修改图片</div>
                    <ImageUpload changePic={setImage} maxCount={1} ></ImageUpload>
                </div>
                <div className="text-red-500 m-1">{errorMsg}</div>
                <Button onClick={onSubmit} type="primary" size='large'>提交</Button>
            </Form>
        </Drawer>
    );
};


export default FoodCreate;

