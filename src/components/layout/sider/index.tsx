'use client'

import React, { FC, useEffect, useMemo, useState, useTransition, useCallback } from "react";
import { Layout, Menu, Button } from 'antd';
import { 
  ShopOutlined, 
  BookOutlined, 
  PictureOutlined,
  AppstoreOutlined,
  UserOutlined,
  HistoryOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 80;

type MenuItemConfig = {
  key: string;
  label: string;
  icon: typeof ShopOutlined;
  iconColor: string;
  iconBg: string;
};

const menuList: MenuItemConfig[] = [
  {
    key: "/foodList",
    label: "菜品管理",
    icon: ShopOutlined,
    iconColor: "#6366f1",
    iconBg: "rgba(99, 102, 241, 0.12)",
  },
  {
    key: "/recipeSet",
    label: "食谱计划",
    icon: BookOutlined,
    iconColor: "#10b981",
    iconBg: "rgba(16, 185, 129, 0.12)",
  },
  {
    key: "/imgGenerate",
    label: "图片生成",
    icon: PictureOutlined,
    iconColor: "#f97316",
    iconBg: "rgba(249, 115, 22, 0.12)",
  },
  {
    key: "/userList",
    label: "用户管理",
    icon: UserOutlined,
    iconColor: "#8b5cf6",
    iconBg: "rgba(139, 92, 246, 0.12)",
  },
  {
    key: "/recipeHistory",
    label: "料理历史",
    icon: HistoryOutlined,
    iconColor: "#ec4899",
    iconBg: "rgba(236, 72, 153, 0.12)",
  },
  {
    key: "/blindBoxHistory",
    label: "盲盒历史",
    icon: GiftOutlined,
    iconColor: "#f59e0b",
    iconBg: "rgba(245, 158, 11, 0.12)",
  },
];

const SideBar: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState('/foodList');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setSelectedKey(pathname);
  }, [pathname]);

  useEffect(() => {
    const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--sidebar-current-width', `${width}px`);
    }
  }, [collapsed]);

  useEffect(() => {
    menuList.forEach(item => {
      try {
        router.prefetch?.(item.key);
      } catch (error) {
        // ignore prefetch errors (e.g. during static export)
      }
    });
  }, [router]);

  const menuItems = useMemo(() => menuList.map((item) => ({
    key: item.key,
    icon: (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          background: item.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <item.icon style={{ color: item.iconColor, fontSize: 18 }} />
      </div>
    ),
    label: item.label,
  })), []);

  const handleSelect = useCallback((e: any) => {
    if (e.key === selectedKey) return;
    // 立即更新选中状态，提供即时视觉反馈
    setSelectedKey(e.key);
    // 立即路由切换，不等待
    router.push(e.key);
  }, [selectedKey, router]);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <Sider
      width={collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH}
      collapsedWidth={COLLAPSED_WIDTH}
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        overflow: 'hidden',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '4px 0 24px rgba(15, 23, 42, 0.08)',
        background: '#ffffff',
        zIndex: 1000,
        borderRight: '1px solid #e2e8f0',
        transition: 'width 0.25s ease',
      }}
      theme="light"
    >
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #edf2f7',
        marginBottom: 12,
      }}>
        <div style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0 12px' : '0 8px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 12,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.25)',
            }}>
              <AppstoreOutlined style={{ fontSize: 20, color: '#ffffff' }} />
            </div>
            {!collapsed && (
              <span style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1f2937',
                letterSpacing: '-0.02em',
              }}>
                卡路里管理
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            padding: collapsed ? '0' : '0 8px',
            display: 'flex',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <Button
            type="text"
            size="small"
            onClick={toggleCollapse}
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              color: '#4b5563',
            }}
          >
            {collapsed ? '>' : '<'}
          </Button>
        </div>
      </div>
      <Menu
        items={menuItems}
        theme="light"
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        onClick={handleSelect}
        style={{
          border: 'none',
          background: 'transparent',
          padding: '8px 0',
        }}
        className="modern-sidebar-menu"
      />
    </Sider>
  );
};

export default SideBar;
