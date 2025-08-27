'use client'
import {FC, useCallback} from "react";
import {Button, Col, Form, Row, Space} from "antd";
import {useForm} from "antd/es/form/Form";
import {ISubmitModule} from "@/components/interface";
import { trimAndRemoveUndefined } from "@/app/utils";

const Filter:FC<ISubmitModule> = ({submit, children}) => {
    const [form] = useForm();

    const submitEvent = useCallback(() => {
        const values = form.getFieldsValue();
        
        // 对所有属性进行trim
        submit && submit(trimAndRemoveUndefined(values))
    }, [form, submit])


    return <Form form={form} style={{width:"80%"}} >
        <Row gutter={[15, 15]}>
            {children}
            <Col span={3}>
                <Space>
                    <Button type="primary" onClick={submitEvent}>
                        查询
                    </Button>
                    <Button onClick={() => { form.resetFields(); }}>
                        重置
                    </Button>
                </Space>
            </Col>
        </Row>
    </Form>
}

export default Filter;
