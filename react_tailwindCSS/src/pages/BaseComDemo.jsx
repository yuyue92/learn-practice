// demo.jsx
import React, { useState } from 'react';
import { Button, TextInput, Select, Checkbox, Textarea, RadioGroup, Modal, List, DataTable, Form, Badge } from './BaseComponent'; // 假设你把组件库存放在 components 文件夹下

export default function Demo() {
    const [modalOpen, setModalOpen] = useState(false);
    const [items, setItems] = useState([
        { id: 1, title: '条目 1', desc: '这是一个示例条目' },
        { id: 2, title: '条目 2', desc: '这是第二个示例条目' },
    ]);
    const [rows, setRows] = useState([
        { id: 1, name: 'Alice', email: 'alice@example.com', role: 'user' },
        { id: 2, name: 'Bob', email: 'bob@example.com', role: 'admin' },
        { id: 3, name: 'Cindy', email: 'cindy@example.com', role: 'user' },
    ]);
    const [query, setQuery] = useState('');

    // 表单配置
    const formFields = [
        { name: 'name', label: '姓名', required: true, placeholder: '请输入姓名' },
        { name: 'age', label: '年龄', type: 'number', min: 0, max: 120 },
        { name: 'email', label: '邮箱', type: 'email', pattern: '\\S+@\\S+\\.\\S+', placeholder: 'name@example.com' },
        { name: 'role', label: '角色', type: 'select', options: [{ label: '用户', value: 'user' }, { label: '管理员', value: 'admin' }] },
        { name: 'bio', label: '简介', type: 'textarea', rows: 3 },
        { name: 'agree', label: '我已阅读并同意条款', type: 'checkbox', required: true },
        { name: 'gender', label: '性别', type: 'radio-group', options: [{ label: '男', value: 'male' }, { label: '女', value: 'female' }] },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
                    <h1 className="text-xl font-semibold">React + Tailwind 组件库（非TS）</h1>
                    <span className="text-xs text-slate-500">表单 / 列表 / 表格 / 弹窗</span>
                    <div className="ml-auto">
                        <Button variant="outline" onClick={() => setModalOpen(true)}>打开弹窗</Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
                {/* 表单示例 */}
                <section className="bg-white border rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">Form（自定义表单）</h2>
                    </div>
                    <Form
                        submitText="提交"
                        fields={formFields}
                        onSubmit={(values) => alert('提交成功\n' + JSON.stringify(values, null, 2))}
                    />
                </section>

                {/* 列表示例 */}
                <section className="bg-white border rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">List（列表展示）</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setItems(arr => [...arr].sort(() => Math.random() - 0.5))}>随机顺序</Button>
                            <Button variant="outline" onClick={() => setItems(arr => arr.slice(0, -1))} disabled={!items.length}>删除末尾</Button>
                            <Button onClick={() => setItems(arr => [...arr, { id: (arr.at(-1)?.id || 0) + 1, title: `条目 ${(arr.at(-1)?.id || 0) + 1}`, desc: '新追加的一条~' }])}>追加一条</Button>
                        </div>
                    </div>
                    <List
                        items={items}
                        renderItem={(item) => (
                            <>
                                <div className="font-medium mb-1">{item.title}</div>
                                <div className="text-xs text-slate-600 mb-3">{item.desc}</div>
                                <Button variant="outline" size="sm" onClick={() => alert(`点击：${item.title}`)}>查看</Button>
                            </>
                        )}
                    />
                </section>

                {/* 表格示例 */}
                <section className="bg-white border rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold">DataTable（数据表格）</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setRows(rs => {
                                const id = (rs.at(-1)?.id || 0) + 1;
                                return [...rs, { id, name: `New ${id}`, email: `new${id}@example.com`, role: Math.random() > 0.5 ? 'admin' : 'user' }];
                            })}>新增一行</Button>
                            <Button variant="outline" onClick={() => {
                                const dataStr = JSON.stringify(rows, null, 2);
                                const blob = new Blob([dataStr], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url; a.download = 'table-data.json'; a.click(); URL.revokeObjectURL(url);
                            }}>导出JSON</Button>
                        </div>
                    </div>
                    <DataTable
                        columns={[
                            { key: 'id', header: 'ID', align: 'center', sortable: true },
                            { key: 'name', header: '姓名', sortable: true },
                            { key: 'email', header: '邮箱', sortable: true },
                            {
                                key: 'role', header: '角色', align: 'center', sortable: true, cell: ({ value }) => (
                                    <Badge color={value === 'admin' ? 'indigo' : 'emerald'}>{value}</Badge>
                                )
                            },
                            {
                                key: 'actions', header: '操作', align: 'right', cell: ({ row }) => (
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="outline" onClick={() => alert(`编辑 ${row.name}`)}>编辑</Button>
                                        <Button size="sm" variant="danger" onClick={() => setRows(rs => rs.filter(r => r.id !== row.id))}>删除</Button>
                                    </div>
                                )
                            }
                        ]}
                        data={rows}
                        pageSize={5}
                        query={query}
                        onQueryChange={setQuery}
                    />
                </section>
            </main>

            {/* 弹窗示例 */}
            <Modal
                open={modalOpen}
                onOpenChange={setModalOpen}
                title="演示弹窗"
                footer={(
                    <>
                        <Button variant="outline" onClick={() => setModalOpen(false)}>取消</Button>
                        <Button onClick={() => setModalOpen(false)}>确定</Button>
                    </>
                )}
            >
                <p className="text-sm text-slate-700">
                    这是一个可复用的 React 弹窗组件，支持 ESC / 点击遮罩关闭与焦点圈定（Focus Trap）。
                </p>
            </Modal>
        </div>
    );
}
