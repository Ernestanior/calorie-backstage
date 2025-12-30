import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Content } from "antd/es/layout/layout";
import SideBar from "@/components/layout/sider";
import Header from "@/components/layout/header";
import { Layout, ConfigProvider } from "antd";
import zhCN from 'antd/locale/zh_CN';
import { AntdRegistry } from "@ant-design/nextjs-registry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "卡路里管理后台",
  description: "专业的卡路里和食谱管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ minWidth: 1200 }}
      >
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                colorPrimary: '#6366f1',
                borderRadius: 10,
                fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              },
              components: {
                Layout: {
                  bodyBg: '#fafbfc',
                  headerBg: 'rgba(255, 255, 255, 0.8)',
                  siderBg: '#ffffff',
                },
                Table: {
                  headerBg: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                  headerColor: '#1e293b',
                  borderRadius: 16,
                },
                Menu: {
                  itemSelectedBg: 'rgba(99, 102, 241, 0.25)',
                  itemHoverBg: 'rgba(99, 102, 241, 0.15)',
                  itemActiveBg: 'rgba(99, 102, 241, 0.25)',
                },
                Button: {
                  primaryShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
                },
              },
            }}
          >
            <Layout style={{ minHeight: "100vh" }}>
              <SideBar />
              <Layout>
                <Header />
                <Content style={{ 
                  marginLeft: 'var(--sidebar-current-width)',
                  marginTop: 72,
                  padding: 0,
                  background: 'var(--background)',
                  minHeight: 'calc(100vh - 72px)',
                  overflow: 'auto'
                }}>
                  <div className="page-container">
                    {children}
                  </div>
                </Content>
              </Layout>
            </Layout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
