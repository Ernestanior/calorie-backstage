'use client'

import React, {FC} from "react";
import {Layout, Menu} from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";

const AntSide = Layout.Sider

const { SubMenu } = Menu;

enum E_USER_TYPE{
    ADMIN='admin',
     OPERATOR='operator'
 }
 

const SideBar:FC = () => {
    const router = useRouter();
    const menuList: any[] = [
        {
            key:"/foodList",
            icon:<ShopOutlined /> ,
            label: "菜品",
            role:[E_USER_TYPE.ADMIN],
        },
        {
            key:"/recipeSet",
            icon:<ShopOutlined /> ,
            label: "食谱计划",
            role:[E_USER_TYPE.ADMIN],
        },
        {
            key:"/imgGenerate",
            icon:<ShopOutlined /> ,
            label: "字生图",
            role:[E_USER_TYPE.ADMIN],
        },
    ]

    const onSelect=(e:any)=>{
        router.replace(e.key);
    }

    return <AntSide >
        <Menu items={menuList} theme="dark" mode="inline" style={{fontWeight:550,marginTop:70}} onClick={onSelect}/>
    </AntSide>
}

export default SideBar;
