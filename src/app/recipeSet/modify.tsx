'use client'
import React, { FC, useEffect, useRef, useState } from "react";
import { Button, Divider, Drawer, Form, Input, InputNumber, InputRef, Select, Space, Image, Tag, UploadFile } from "antd";
import { fileUpload, recipeSetModify } from "@/network/api";
import { useForm } from "antd/es/form/Form";
import { PlusOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import { initlabels, initlabelsEn, timeList, weightList, weightType } from "./config";
import ImageUpload from "@/components/ImageUpload";
import { RcFile } from "antd/es/upload";

interface IProps {
    data: any;
    visible: boolean;
    onCancel: any;
    onRefresh: any;
}
let index = 0
const RecipeSetModify: FC<IProps> = ({ data, visible, onRefresh, onCancel }) => {
    const [form] = useForm()
    const [errorMsg, setErrMsg] = useState<string>('')
    const [image, setImage] = useState<UploadFile[]>([])
    const inputRef = useRef<InputRef>(null);
    const [label, setLabel] = useState<string>()
    const [labelList, setLabelList] = useState<string[]>(initlabels)

    useEffect(() => {
        if (data) {
            // 后端现在返回的是 label: string[]，这里根据标签文本映射成下拉的索引值
            const labels: string[] = (data as any).label || (data as any).labelList || [];
            form.setFieldsValue({
                ...data,
                labelList: labels.map((item: string) => initlabels.indexOf(item)),
            });
        } else {
            form.setFieldsValue({});
        }
    }, [form, data])

    const addLabel = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setLabelList([...labelList, label || `New item ${index++}`]);
        setLabel('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const onSubmit = async () => {
        const newData = form.getFieldsValue()
        const { day, hot, name, type, nameEn, weight, labelList, color, visible } = newData
        console.log(newData,'newData');
        
        if (!name || !nameEn || !day || !hot || !weight || !type || !color || !labelList.length) {
            setErrMsg('* 请填写完整')
            return
        } else {
            setErrMsg('')
        }

        let params
        if (image.length) {
            const imgFormData = new FormData()
            image.forEach(img => {
                imgFormData.append('file', img.originFileObj as RcFile);
            });
            const previewPhoto = await fileUpload(imgFormData as any);
            params = {
                id: newData.id, day, hot, type, weight, name, nameEn, color, visible, labelList: labelList.map((index: number) => initlabels[index]), labelEnList: labelList.map((index: number) => initlabelsEn[index]),
                previewPhoto
            }
        } else {
            params = {
                id: newData.id, day, hot, type, weight, name, nameEn, color, visible, labelList: labelList.map((index: number) => initlabels[index]), labelEnList: labelList.map((index: number) => initlabelsEn[index])
            }
        }

        const res = await recipeSetModify(params)
        onCancel()
        onRefresh()
    }

    return (
        <Drawer title="修改食谱" width={900} onClose={onCancel} open={visible}>
            <Form form={form} >
                <Form.Item name={'id'} label="id" required>
                    <Input style={{ width: 350 }} disabled />
                </Form.Item>
                <Form.Item name={'name'} label="食谱中文名" required>
                    <Input style={{ width: 350 }} />
                </Form.Item>
                <Form.Item name={'nameEn'} label="食谱英文名" required>
                    <Input style={{ width: 350 }} />
                </Form.Item>
                <div className="flex flex-row mb-5 items-center">

                    <Form.Item name={'type'} label="减重/增重" required>
                        <Select
                            style={{ width: 150, marginRight: 50 }}
                            placeholder="Please select"
                            options={weightType}
                        />
                    </Form.Item>
                    <Form.Item name={'visible'} label="隐藏/显示" required>
                        <Select
                            style={{ width: 150, marginRight: 50 }}
                            placeholder="Please select"
                            options={[{ label: '显示', value: 1 }, { label: '隐藏', value: 0 }]}
                        />
                    </Form.Item>
                </div>

                <div className="flex flex-row mb-5">
                    <Form.Item name={'day'} label="计划时长" required>
                        <Select
                            allowClear
                            style={{ width: 100, marginRight: 50 }}
                            placeholder="Please select"
                            options={timeList}
                        />
                    </Form.Item>
                    <Form.Item name={'weight'} label="计划减重" required>
                        <Select
                            style={{ width: 150, marginRight: 50 }}
                            placeholder="Please select"
                            options={weightList}
                        />
                    </Form.Item>
                </div>

                <div className="flex flex-row mb-5">
                    <Form.Item name={'hot'} label="热度" required>
                        <InputNumber style={{ width: 150, marginRight: 50 }} />
                    </Form.Item>
                    <Form.Item name={'color'} label="颜色" required>
                        <Input style={{ width: 150 }} />
                    </Form.Item>
                </div>

                <div className="flex flex-row mb-5 items-center">
                    <FormItem name="labelList" label={'标签'}>
                        <Select
                            mode="multiple"
                            style={{ width: 400 }}
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Space style={{ padding: '0 8px 4px' }}>
                                        <Input
                                            placeholder="Please enter item"
                                            ref={inputRef}
                                            value={label}
                                            onChange={(e) => setLabel(e.target.value)}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} onClick={addLabel}>
                                            添加标签
                                        </Button>
                                    </Space>
                                </>
                            )}
                            options={labelList.map((item, index) => ({ label: item, value: index }))}
                        />
                    </FormItem>
                </div>
                <div className="flex flex-row mb-5">
                    <Image alt="" src={data.previewPhoto} width={200} />
                    <div className="text-sm font-bold ml-15 mr-5">修改图片</div>
                    <ImageUpload changePic={setImage} maxCount={1} ></ImageUpload>
                </div>
                <div className="text-red-500 m-1">{errorMsg}</div>
                <Button onClick={onSubmit} type="primary" size='large'>提交</Button>
            </Form>
        </Drawer>
    );
};


export default RecipeSetModify;

