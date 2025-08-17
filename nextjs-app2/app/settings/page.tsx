'use client'

import MainLayout from '@/components/layout/main-layout'
import { Form, FormField } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const handleSubmit = async (data: any) => {
    console.log('保存设置:', data)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>

        <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">基本设置</h2>
          
          <Form onSubmit={handleSubmit}>
            <FormField
              label="系统名称"
              name="systemName"
              required
              placeholder="请输入系统名称"
              value="管理系统"
            />
            <FormField
              label="系统描述"
              name="description"
              type="textarea"
              placeholder="请输入系统描述"
              value="基于 Next.js 的现代化管理系统"
            />
            <FormField
              label="邮件通知"
              name="emailNotification"
              type="select"
              options={[
                { value: 'enabled', label: '启用' },
                { value: 'disabled', label: '禁用' }
              ]}
              value="enabled"
            />
            <FormField
              label="最大登录尝试次数"
              name="maxLoginAttempts"
              type="number"
              value={5}
            />
          </Form>
        </div>
      </div>
    </MainLayout>
  )
}