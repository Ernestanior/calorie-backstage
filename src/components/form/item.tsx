'use client'
import {FormItemProps} from "antd/es/form";
import {FC} from "react";
import {Col, Form} from "antd";

interface IProps{
    span?: number;
    flex?: number;
}

const FormItem: FC<FormItemProps & IProps> = ({children, span, flex, ...restProps}) => {
    if(!span && !flex){
        return <Form.Item {...restProps}>
            {children}
        </Form.Item>
    }
    return <Col hidden={restProps.hidden} span={span} flex={flex}>
        <Form.Item {...restProps}>
            {children}
        </Form.Item>
    </Col>
}

export default FormItem
