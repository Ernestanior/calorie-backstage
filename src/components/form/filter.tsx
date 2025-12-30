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


    return (
      <Form form={form} style={{ width: "100%" }}>
        <Row gutter={[16, 16]} align="middle" wrap>
          {children}
          <Col
            flex="auto"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              minWidth: 220,
            }}
          >
            <Space align="center">
              <Button 
                type="primary" 
                onClick={submitEvent}
                style={{
                  height: 40,
                  paddingLeft: 24,
                  paddingRight: 24,
                  fontWeight: 500,
                }}
              >
                查询
              </Button>
              <Button 
                onClick={() => { 
                  form.resetFields(); 
                  submit && submit({});
                }}
                style={{
                  height: 40,
                  paddingLeft: 24,
                  paddingRight: 24,
                  fontWeight: 500,
                  borderColor: 'var(--border)',
                }}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    )
}

export default Filter;
