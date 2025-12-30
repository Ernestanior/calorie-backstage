'use client'
import { FC } from "react";
import { Layout, Space, Avatar, Dropdown, Badge } from 'antd';
import { 
  BellOutlined, 
  UserOutlined, 
  SettingOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

const Index: FC = () => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  return (
    <AntHeader
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 'var(--sidebar-current-width)',
        zIndex: 999,
        height: 72,
        padding: '0 32px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      }}
    >
      <div style={{ flex: 1 }}>
        {/* 可以在这里添加面包屑导航 */}
      </div>
      <Space size="large" style={{ alignItems: 'center' }}>
        <Badge 
          count={3} 
          size="small"
          style={{
            boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.8)',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.background = 'rgba(99, 102, 241, 0.1)';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.background = 'transparent';
            }}
          >
            <BellOutlined 
              style={{ 
                fontSize: 20, 
                color: 'var(--text-secondary)',
              }}
            />
          </div>
        </Badge>
        <Dropdown 
          menu={{ items: userMenuItems }} 
          placement="bottomRight"
          overlayStyle={{
            borderRadius: 12,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Space 
            style={{ 
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: 12,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.background = 'rgba(99, 102, 241, 0.1)';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement;
              target.style.background = 'transparent';
            }}
          >
            <Avatar 
              size={36}
              icon={<UserOutlined />}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              }}
            />
            <span style={{ 
              color: 'var(--text-primary)', 
              fontSize: 14,
              fontWeight: 500,
            }}>
              管理员
            </span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}

export default Index;
