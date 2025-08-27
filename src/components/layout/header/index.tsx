'use client'
import { FC } from "react";
import {Space, Row, Col} from 'antd';

const Index:FC = () => {

    return <nav className='comp-header'>
        <Row align="middle">
            <Col flex={1}>
                <span>
                    {/* <Image className="logo" src={Logo} alt="logo" /> */}
                </span>
            </Col>
            <Col>
                <Space className="right-options" size="large">
                    {/*<IconFont*/}
                    {/*    className="ant-dropdown-link"*/}
                    {/*    style={{ fontSize: 24 }}*/}
                    {/*    type="icon-customer-bussinessman"*/}
                    {/*/>*/}
                    {/* <UserPopover /> */}
                    {/* <ConfirmInfo info={'确定登出？'} submit={() => { accountService.autoLogout() }}>
                        <IconFont type="icon-shut-down" style={{fontSize:24}}/>
                    </ConfirmInfo> */}
                </Space>
            </Col>
        </Row>
    </nav>
}

export default Index;
