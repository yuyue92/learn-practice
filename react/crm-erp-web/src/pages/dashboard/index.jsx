/**
 * 仪表盘页面
 */

import { useAuthStore } from '@/stores';

function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="page-container">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="page-title">欢迎回来, {user?.realName || user?.username}!</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          这是您的工作台,快速查看关键数据和待办事项
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="客户总数"
          value="1,234"
          change="+12%"
          trend="up"
          icon="👥"
        />
        <StatCard
          title="本月销售额"
          value="¥ 256,789"
          change="+8%"
          trend="up"
          icon="💰"
        />
        <StatCard
          title="待处理订单"
          value="45"
          change="-5%"
          trend="down"
          icon="📦"
        />
        <StatCard
          title="库存预警"
          value="12"
          change="+3"
          trend="warning"
          icon="⚠️"
        />
      </div>

      {/* 内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近客户 */}
        <div className="card p-6">
          <h2 className="section-title">最近客户</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                    {item}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      客户 {item}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      最后跟进: 2天前
                    </p>
                  </div>
                </div>
                <span className="badge badge-success">成交客户</span>
              </div>
            ))}
          </div>
        </div>

        {/* 待办事项 */}
        <div className="card p-6">
          <h2 className="section-title">待办事项</h2>
          <div className="space-y-4">
            {[
              { title: '跟进客户A', time: '今天 14:00', priority: 'high' },
              { title: '审核订单#1234', time: '今天 16:00', priority: 'medium' },
              { title: '库存盘点', time: '明天', priority: 'low' },
            ].map((todo, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {todo.title}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {todo.time}
                    </p>
                  </div>
                </div>
                <span
                  className={`badge ${
                    todo.priority === 'high'
                      ? 'badge-danger'
                      : todo.priority === 'medium'
                      ? 'badge-warning'
                      : 'badge-neutral'
                  }`}
                >
                  {todo.priority === 'high' ? '紧急' : todo.priority === 'medium' ? '普通' : '低'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({ title, value, change, trend, icon }) {
  const trendColors = {
    up: 'text-success-600 dark:text-success-400',
    down: 'text-danger-600 dark:text-danger-400',
    warning: 'text-warning-600 dark:text-warning-400',
  };

  return (
    <div className="card p-6 card-hover">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-sm font-medium ${trendColors[trend]}`}>{change}</span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{value}</p>
    </div>
  );
}

export default Dashboard;
