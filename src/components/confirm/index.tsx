'use client'
import {FC} from "react";
import {Popconfirm} from "antd";
import {IConfirmModule} from "../interface";

const ConfirmInfo:FC<IConfirmModule> = ({info, submit, children}) => {
    return <Popconfirm title={info} onConfirm={submit}>
        {children}
    </Popconfirm>
}

export default ConfirmInfo
