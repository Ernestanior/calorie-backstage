'use client'
import React, {FC, useRef, useState} from "react";
import { Button, Divider, Drawer, Form, Input, InputNumber, InputRef, notification, Select, Space, Table, Tag, UploadFile } from "antd";
import {  fileUpload, recipeSetCreate } from "@/network/api";
import { timeList, weightList, initlabelsEn,weightType, initlabels} from './config'
import {useForm} from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import ImageUpload from "@/components/ImageUpload";

interface IProps{
    visible:boolean;
    onCancel:any;
    onRefresh:any;
}
let index=0
const FoodCreate: FC<IProps> = ({visible,onRefresh,onCancel}) => {
    const [form] = useForm()
    const inputRef = useRef<InputRef>(null);
    const [label,setLabel]=useState<string>()
    const [labels,setLabels]=useState<string[]>(initlabels)
    const [errorMsg,setErrMsg]=useState<string>('')
    const [image,setImage] = useState<UploadFile[]>([])

    const addLabel = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setLabels([...labels, label || `New item ${index++}`]);
        setLabel('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };
    const onSubmit=async()=>{
        const newData = form.getFieldsValue()
        const {day,hot,name,type,nameEn,weight,labelList,color}=newData

        if(!name || !nameEn || !day || !hot || !weight || !type || !color || !labelList.length || !image.length ){
            setErrMsg('* 请填写完整')
            return 
        }else{
            setErrMsg('')
        }
        console.log(image);
        
        const imgFormData = new FormData()
        image.forEach(img => {
            imgFormData.append('file', img.originFileObj as RcFile);
        });
        const previewPhoto = await fileUpload(imgFormData as any);
        

        const params = {
            day,hot,type,weight,name,nameEn,color,
            labelList:labelList.map((index:number) => initlabels[index]),
            labelEnList:labelList.map((index:number) => initlabelsEn[index]),
            previewPhoto
          }
          
        const res = await recipeSetCreate(params)    
        onCancel()
        onRefresh()
    }

    return (
        <Drawer title="新增食谱" width={900} onClose={onCancel} open={visible}>
            <Form form={form} >
                <div className="flex flex-row mb-5 items-center">
                    <Form.Item name={'name'} label="食谱中文名" required>
                        <Input style={{width:350}}/>
                    </Form.Item>


                </div>
                <div className="flex flex-row mb-5 items-center">

                <Form.Item name={'nameEn'} label="食谱英文名" required>
                        <Input style={{width:350}}/>
                    </Form.Item>
                </div>
                <Form.Item name={'type'} label="减重/增重" required>
                        <Select
                            style={{ width: 150,marginRight:50}}
                            placeholder="Please select"
                            options={weightType}
                        />
                    </Form.Item>

                <div className="flex flex-row mb-5">
                <Form.Item name={'day'} label="计划时长" required>
                        <Select
                            allowClear
                            style={{ width: 100,marginRight:50}}
                            placeholder="Please select"
                            options={timeList}
                        />
                    </Form.Item>
                    <Form.Item name={'weight'} label="计划体重" required>
                        <Select
                            style={{ width: 150,marginRight:50}}
                            placeholder="Please select"
                            options={weightList}
                        />
                    </Form.Item>

                

                </div>
                <div className="flex flex-row mb-5">

                <Form.Item name={'hot'} label="热度" required>
                        <InputNumber style={{width:150,marginRight:50}}/>
                    </Form.Item>
                <Form.Item name={'color'} label="颜色" required>
                        <Input style={{width:150}}/>
                    </Form.Item>
                </div>

                <div className="flex flex-row mb-5 items-center">
                <FormItem name="labelList" label={'标签'}>
                    <Select
                        mode="multiple"
                        style={{width:400}}
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <Space style={{ padding: '0 8px 4px' }}>
                                    <Input
                                        placeholder="Please enter item"
                                        ref={inputRef}
                                        value={label}
                                        onChange={(e)=>setLabel(e.target.value)}
                                    />
                                    <Button type="text" icon={<PlusOutlined />} onClick={addLabel}>
                                        添加标签
                                    </Button>
                                </Space>
                            </>
                        )}
                        options={labels.map((item,index) => ({ label: item, value: index }))}
                    />
                </FormItem>
                </div>
                <div className="flex flex-row mb-5">
                    <div className="text-sm mr-5">图片</div>
                    <ImageUpload changePic={setImage} maxCount={1} ></ImageUpload>
                </div>
                <div className="text-red-500 m-1">{errorMsg}</div>
                <Button onClick={onSubmit} type="primary" size='large'>提交</Button>
            </Form>
        </Drawer>
    );
};


export default FoodCreate;


