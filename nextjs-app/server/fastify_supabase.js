// @ts-nocheck
import Fastify from 'fastify';
import { createClient } from '@supabase/supabase-js';
import fastifyCors from '@fastify/cors';

const fastify = Fastify({ logger: true });

const PORT = 3001;
const SUPABASE_URL = 'https://ohdlqfndgandyhnefgnm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZGxxZm5kZ2FuZHlobmVmZ25tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTMyNTgsImV4cCI6MjA3NTY4OTI1OH0.I36ScoBGygR08mvDhFmvPFJvl7Wx3U6OQrARm1a8EUs'
// 创建 supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 允许跨域
fastify.register(fastifyCors, {
    origin: (origin, cb) => {
        // 允许本地文件打开（origin === 'null'）以及常见本地开发域名
        if (!origin) return cb(null, true); // 某些浏览器/请求可能没有 Origin
        const ok =
            origin === 'null' ||
            origin.startsWith('http://localhost') ||
            origin.startsWith('http://127.0.0.1');
        cb(null, ok);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
})
// 路由：测试接口
fastify.get('/', async (req, reply) => {
    return { message: 'Fastify + Supabase service is running!' };
});

// 获取任务列表
fastify.get('/api/tasks', async (req, reply) => {
    const { data, error } = await supabase.from('tasklist').select('*').order('id', { ascending: true });;
    if (error) return reply.status(500).send(error);
    return data;
});
// 新增任务
fastify.post('/api/tasks', async (req, reply) => {
    const { text, completed } = req.body;
    const { data, error } = await supabase.from('tasklist').insert([{ text, completed }]);
    if (error) return reply.status(500).send(error);
    return data;
});

// 更新任务
fastify.put('/api/tasks/:id', async (req, reply) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    const { data, error } = await supabase.from('tasklist').update({ text, completed }).eq('id', id);
    if (error) return reply.status(500).send(error);
    return data;
});

// 删除任务
fastify.delete('/api/tasks/:id', async (req, reply) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('tasklist').delete().eq('id', id);
    if (error) return reply.status(500).send(error);
    return { message: 'Task deleted successfully', data };
});

// 启动服务器
const start = async () => {
    try {
        fastify.listen({ port: PORT });
        console.log(`✅ Fastify server running at http://localhost:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();