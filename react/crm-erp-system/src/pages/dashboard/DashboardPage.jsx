/**
 * 工作台页面
 */
import { HiOutlineUsers, HiOutlineCurrencyYen, HiOutlineCube, HiOutlineClipboardCheck, HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserStore } from '@/stores';
import { ROLE_NAMES } from '@/constants/permissions';
import { formatMoney, formatNumber } from '@/utils/helpers';
import clsx from 'clsx';

const mockStats = [
  { icon: HiOutlineUsers, title: '客户总数', value: 1256, trend: 12.5, up: true, color: 'primary' },
  { icon: HiOutlineCurrencyYen, title: '销售总额', value: 2580000, trend: 8.2, up: true, color: 'success', money: true },
  { icon: HiOutlineCube, title: '产品数量', value: 486, trend: -2.1, up: false, color: 'secondary' },
  { icon: HiOutlineClipboardCheck, title: '待处理订单', value: 32, trend: 15.3, up: true, color: 'warning' },
];

const salesData = [
  { month: '1月', sales: 180000 }, { month: '2月', sales: 220000 }, { month: '3月', sales: 195000 },
  { month: '4月', sales: 280000 }, { month: '5月', sales: 320000 }, { month: '6月', sales: 285000 },
  { month: '7月', sales: 350000 }, { month: '8月', sales: 380000 }, { month: '9月', sales: 420000 },
  { month: '10月', sales: 390000 }, { month: '11月', sales: 450000 }, { month: '12月', sales: 520000 },
];

const customerData = [
  { name: '潜在客户', value: 320, color: '#a3a3a3' },
  { name: '意向客户', value: 450, color: '#fbbf24' },
  { name: '成交客户', value: 380, color: '#22c55e' },
  { name: '流失客户', value: 106, color: '#ef4444' },
];

const DashboardPage = () => {
  const { user } = useUserStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">欢迎回来，{user?.name}</h1>
        <p className="text-neutral-500 mt-1">{ROLE_NAMES[user?.role]}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">{stat.title}</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {stat.money ? formatMoney(stat.value) : formatNumber(stat.value)}
                </p>
                <div className={clsx('flex items-center gap-1 mt-2 text-sm', stat.up ? 'text-success-600' : 'text-danger-600')}>
                  {stat.up ? <HiOutlineArrowUp className="w-4 h-4" /> : <HiOutlineArrowDown className="w-4 h-4" />}
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">销售趋势</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `${v / 10000}万`} />
                <Tooltip formatter={(v) => formatMoney(v)} />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fill="url(#salesGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">客户分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={customerData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {customerData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {customerData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
