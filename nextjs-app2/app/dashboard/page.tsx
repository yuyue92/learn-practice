'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Table } from '@/components/ui/table'
import { List, CardList } from '@/components/ui/list'
import { Form, FormField } from '@/components/ui/form'
import { User, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react'

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  // 模拟数据
  const stats = [
    { title: '总用户数', value: '12,345', icon: Users, trend: '+12%', color: 'bg-blue-500' },
    { title: '总订单数', value: '8,234', icon: ShoppingCart, trend: '+8%', color: 'bg-green-500' },
    { title: '总收入', value: '¥123,456', icon: DollarSign, trend: '+15%', color: 'bg-yellow-500' },
    { title: '增长率', value: '23.5%', icon: TrendingUp, trend: '+2%', color: 'bg-purple-500' }
  ]

  const tableData = [
    { id: '1', name: '张三', email: 'zhangsan@example.com', role: 'admin', status: '活跃', createdAt: '2024-01-01' },
    { id: '2', name: '李四', email: 'lisi@example.com', role: 'user', status: '活跃', createdAt: '2024-01-02' },
    { id: '3', name: '王五', email: 'wangwu@example.com', role: 'editor', status: '禁用', createdAt: '2024-01-03' }
  ]

  const columns = [
    { key: 'name', title: '姓名', dataIndex: 'name', sortable: true },
    { key: 'email', title: '邮箱', dataIndex: 'email' },
    { 
      key: 'role', 
      title: '角色', 
      dataIndex: 'role',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'admin' ? 'bg-red-100 text-red-800' :
          value === 'editor' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: (value: string) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === '活跃' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'createdAt', title: '创建时间', dataIndex: 'createdAt', sortable: true },
    {
      key: 'actions',
      title: '操作',
      dataIndex: 'actions',
      render: () => (
        <div className="space-x-2">
          <Button size="sm" variant="outline">编辑</Button>
          <Button 
            size="sm" 
            variant="destructive"
            permission={{ resource: 'users', action: 'delete' }}
          >
            删除
          </Button>
        </div>
      )
    }
  ]

  const listItems = [
    {
      id: '1',
      title: '系统更新',
      description: '系统将在今晚进行维护更新',
      extra: '2小时前',
      avatar: <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">系</div>
    },
    {
      id: '2',
      title: '新用户注册',
      description: '用户 "张三" 刚刚注册了账号',
      extra: '1小时前',
      avatar: <User className="h-8 w-8 text-gray-600" />
    }
  ]

  const cardItems = [
    {
      id: '1',
      title: '产品管理',
      description: '管理系统中的所有产品信息',
      avatar: <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">📦</div>,
      actions: <Button size="sm">进入</Button>
    },
    {
      id: '2',
      title: '用户管理',
      description: '管理系统用户和权限设置',
      avatar: <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">👥</div>,
      actions: <Button size="sm">进入</Button>
    }
  ]

  const handleSubmit = async (data: any) => {
    console.log('提交的数据:', data)
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowUserModal(false)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
          <div className="space-x-2">
            <Button onClick={() => setShowModal(true)}>
              打开弹框
            </Button>
            <Button 
              onClick={() => setShowUserModal(true)}
              permission={{ resource: 'users', action: 'create' }}
            >
              添加用户
            </Button>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.trend}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 表格组件示例 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">用户列表</h2>
          <Table
            columns={columns}
            data={tableData}
            pagination={{
              current: 1,
              pageSize: 10,
              total: 100,
              onChange: (page, pageSize) => console.log('分页变化:', page, pageSize)
            }}
            onRowClick={(record) => console.log('点击行:', record)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 列表组件示例 */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">最新动态</h2>
            <List items={listItems} />
          </div>

          {/* 卡片列表示例 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">快速入口</h2>
            <CardList items={cardItems} columns={1} />
          </div>
        </div>

        {/* 弹框示例 */}
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title="示例弹框"
          footer={
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                取消
              </Button>
              <Button onClick={() => setShowModal(false)}>
                确定
              </Button>
            </div>
          }
        >
          <p>这是一个示例弹框的内容。</p>
        </Modal>

        {/* 表单弹框示例 */}
        <Modal
          open={showUserModal}
          onClose={() => setShowUserModal(false)}
          title="添加用户"
          size="md"
        >
          <Form onSubmit={handleSubmit}>
            <FormField
              label="用户名"
              name="name"
              required
              placeholder="请输入用户名"
            />
            <FormField
              label="邮箱"
              name="email"
              type="email"
              required
              placeholder="请输入邮箱"
            />
            <FormField
              label="角色"
              name="role"
              type="select"
              required
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'editor', label: '编辑者' },
                { value: 'user', label: '普通用户' }
              ]}
            />
            <FormField
              label="备注"
              name="remark"
              type="textarea"
              placeholder="请输入备注信息"
            />
          </Form>
        </Modal>
      </div>
    </MainLayout>
  )
}