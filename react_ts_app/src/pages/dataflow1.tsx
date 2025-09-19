import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  MarkerType,
  Handle,
  Position,
  type Node,
  type Edge,
  type Connection,
  type NodeProps,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/** ------------ 自定义节点 --------------- */
type NodeData = { label: string; onRename?: (id: string) => void };

function DataNode({ id, data, selected }: NodeProps<NodeData>) {
  return (
    <div
      onDoubleClick={() => data.onRename?.(id)}
      style={{
        border: `1px solid ${selected ? "#a5b4fc" : "#e5e7eb"}`,
        borderRadius: 16,
        padding: "10px 14px",
        background: "#fff",
        minWidth: 150,
        boxShadow: "0 1px 6px rgba(0,0,0,.06)",
        userSelect: "none",
      }}
    >
      <div style={{ fontWeight: 600, color: "#111827" }}>{data.label}</div>
      <div style={{ fontSize: 11, color: "#6b7280" }}>
        双击重命名 · 右把手拖出连线
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
const nodeTypes = { dataNode: DataNode };

/** ------------ 初始数据 --------------- */
const initialNodes: Node<NodeData>[] = [
  { id: "n1", type: "dataNode", position: { x: 120, y: 120 }, data: { label: "数据源 (Source)" } },
  { id: "n2", type: "dataNode", position: { x: 420, y: 180 }, data: { label: "清洗 (Clean)" } },
  { id: "n3", type: "dataNode", position: { x: 720, y: 140 }, data: { label: "特征工程 (Features)" } },
  { id: "n4", type: "dataNode", position: { x: 1020, y: 200 }, data: { label: "模型训练 (Train)" } },
  { id: "n5", type: "dataNode", position: { x: 1320, y: 260 }, data: { label: "服务部署 (Deploy)" } },
];

const arrow = { type: MarkerType.ArrowClosed, color: "#64748b", width: 18, height: 18 };

const initialEdges: Edge[] = [
  { id: "e1", source: "n1", target: "n2", markerEnd: arrow, style: { stroke: "#64748b", strokeWidth: 2 } },
  { id: "e2", source: "n2", target: "n3", markerEnd: arrow, style: { stroke: "#64748b", strokeWidth: 2 } },
  { id: "e3", source: "n3", target: "n4", markerEnd: arrow, style: { stroke: "#64748b", strokeWidth: 2 } },
  { id: "e4", source: "n4", target: "n5", markerEnd: arrow, style: { stroke: "#64748b", strokeWidth: 2 } },
];

/** ------------ 主组件 --------------- */
export default function App() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rfRef = useRef<ReactFlowInstance | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectionCount, setSelectionCount] = useState({ nodes: 0, edges: 0 });
  const [selfcheck, setSelfcheck] = useState({ ok: true, message: "" });

  /** 自检：边的两端都存在 */
  const computeSelfCheck = useCallback((ns: Node<NodeData>[], es: Edge[]) => {
    const ids = new Set(ns.map((n) => n.id));
    const invalid = es.filter((e) => !ids.has(e.source) || !ids.has(e.target));
    return invalid.length
      ? { ok: false, message: `警告：存在 ${invalid.length} 条无效连线` }
      : { ok: true, message: `通过：节点 ${ns.length} · 连线 ${es.length}` };
  }, []);
  useEffect(() => setSelfcheck(computeSelfCheck(nodes, edges)), [nodes, edges, computeSelfCheck]);

  /** 连接创建（去重） */
  const onConnect = useCallback((params: Connection) => {
    const dup = edges.some((e) => e.source === params.source && e.target === params.target);
    if (dup) return;
    setEdges((eds) =>
      addEdge(
        { ...params, id: "e" + Date.now().toString(36), markerEnd: arrow, style: { stroke: "#64748b", strokeWidth: 2 } },
        eds
      )
    );
  }, [edges, setEdges]);

  /** 选中同步 */
  const onSelectionChange = useCallback(({ nodes: ns, edges: es }: { nodes: Node[]; edges: Edge[] }) => {
    setSelectionCount({ nodes: ns.length, edges: es.length });
    setSelectedNodeId(ns[0]?.id ?? null);
  }, []);

  /** 选中并聚焦到节点 */
  const selectNode = useCallback((id: string) => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === id })));
    setSelectedNodeId(id);
    const n = nodes.find((x) => x.id === id);
    if (n && rfRef.current) {
      rfRef.current.setCenter(n.position.x + 80, n.position.y + 27, { zoom: 1.2, duration: 400 });
    }
  }, [nodes, setNodes]);

  /** 重命名（节点双击 + 表格按钮都用这一套） */
  const renameNode = useCallback((id: string) => {
    const n = nodes.find((x) => x.id === id);
    if (!n) return;
    const v = window.prompt("请输入新的名称", n.data.label);
    if (v && v.trim()) {
      setNodes((nds) => nds.map((x) => (x.id === id ? { ...x, data: { ...x.data, label: v.trim(), onRename: renameNode } } : x)));
    }
  }, [nodes, setNodes]);

  /** 给节点注入 onRename 回调（供 DataNode 双击使用） */
  useEffect(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, onRename: renameNode } })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 工具栏动作 */
  const addNode = useCallback(() => {
    const id = "n" + Date.now().toString(36);
    const rect = wrapperRef.current?.getBoundingClientRect();
    let pos = { x: 200, y: 100 };
    if (rect && rfRef.current) {
      const c = rfRef.current.screenToFlowPosition({ x: rect.width / 2, y: rect.height / 2 });
      pos = { x: c.x - 80, y: c.y - 27 };
    }
    setNodes((nds) => nds.concat({ id, type: "dataNode", position: pos, data: { label: `新节点 ${nds.length + 1}`, onRename: renameNode } }));
    setSelectedNodeId(id);
  }, [renameNode, setNodes]);

  const deleteSelected = useCallback(() => {
    if (!selectedNodeId) return;
    setEdges((es) => es.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setNodes((ns) => ns.filter((n) => n.id !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setEdges, setNodes]);

  const resetGraph = useCallback(() => {
    setNodes(initialNodes.map((n) => ({ ...n, data: { ...n.data, onRename: renameNode } })));
    setEdges(initialEdges);
    setSelectedNodeId(null);
    rfRef.current?.setViewport({ x: 0, y: 0, zoom: 1 });
  }, [renameNode, setEdges, setNodes]);

  /** 导入/导出/本地存取 */
  const exportJSON = useCallback(() => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `dataflow-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const importJSON = useCallback((file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
          const ns: Node<NodeData>[] = data.nodes.map((n: Node<NodeData>) => ({ ...n, data: { ...n.data, onRename: renameNode } }));
          setNodes(ns);
          setEdges(data.edges);
          setSelectedNodeId(null);
          rfRef.current?.setViewport({ x: 0, y: 0, zoom: 1 });
        } else {
          alert("文件格式不正确，应为 {nodes:[], edges:[]}");
        }
      } catch (e) {
        alert("解析失败：" + e);
      }
    };
    reader.readAsText(file);
  }, [renameNode, setEdges, setNodes]);

  const saveLocal = useCallback(() => {
    localStorage.setItem("rf:nodes", JSON.stringify(nodes));
    localStorage.setItem("rf:edges", JSON.stringify(edges));
    alert("已保存到 localStorage");
  }, [nodes, edges]);

  const loadLocal = useCallback(() => {
    const ns = localStorage.getItem("rf:nodes");
    const es = localStorage.getItem("rf:edges");
    if (ns && es) {
      try {
        const nsv: Node<NodeData>[] = JSON.parse(ns).map((n: Node<NodeData>) => ({ ...n, data: { ...n.data, onRename: renameNode } }));
        const esv: Edge[] = JSON.parse(es);
        setNodes(nsv);
        setEdges(esv);
        setSelectedNodeId(null);
        rfRef.current?.setViewport({ x: 0, y: 0, zoom: 1 });
      } catch {
        alert("localStorage 解析失败");
      }
    } else {
      alert("localStorage 未找到保存内容");
    }
  }, [renameNode, setEdges, setNodes]);

  /** Delete 快捷键 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId) deleteSelected();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, selectedNodeId]);

  /** ------------ UI --------------- */
  return (
    <div style={{ width: "100%", height: "100%", background: "#f9fafb", display: "flex", flexDirection: "column" }}>
      {/* 工具栏 */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff", borderBottom: "1px solid #e5e7eb", padding: 8, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 1px 6px rgba(0,0,0,.04)" }}>
        <button className="btn" onClick={addNode}>➕ 新增节点</button>
        <button className="btn" onClick={deleteSelected} disabled={!selectedNodeId}>🗑 删除所选</button>
        <button className="btn" onClick={resetGraph}>⟲ 重置图</button>
        <div style={{ width: 1, height: 24, background: "#e5e7eb", margin: "0 6px" }} />
        <button className="btn" onClick={exportJSON}>⬇️ 导出</button>
        <label className="btn" htmlFor="fileImport" style={{ cursor: "pointer" }}>⬆️ 导入</label>
        <input id="fileImport" type="file" className="hidden" accept="application/json" onChange={(e) => importJSON(e.target.files?.[0] || null)} />
        <button className="btn" onClick={saveLocal}>💾 保存本地</button>
        <button className="btn" onClick={loadLocal}>📂 读取本地</button>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>
          选中：{selectionCount.nodes} 节点 / {selectionCount.edges} 连线 · 自检：
          <span style={{
            marginLeft: 6, padding: "2px 8px", borderRadius: 999,
            border: `1px solid ${selfcheck.ok ? "#bbf7d0" : "#fde68a"}`,
            color: selfcheck.ok ? "#065f46" : "#92400e",
            background: selfcheck.ok ? "#f0fdf4" : "#fffbeb",
          }}>{selfcheck.message}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", minHeight: 0, flex: 1 }}>
        {/* 左：编辑器 */}
        <div ref={wrapperRef} style={{ minHeight: 520, position: "relative" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            proOptions={{ hideAttribution: true }}
            onInit={(inst) => (rfRef.current = inst)}
          >
            <MiniMap pannable zoomable />
            <Controls position="bottom-left" />
            <Background gap={24} color="#e5e7eb" />
          </ReactFlow>
        </div>

        {/* 右：表格联动面板 */}
        <aside style={{ borderLeft: "1px solid #e5e7eb", background: "#fff", minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 10, fontSize: 12, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
            提示：拖拽右侧把手到另一节点即可连线；双击节点重命名；Delete 键删除所选。
          </div>
          <div style={{ padding: 12, overflow: "auto", display: "grid", gap: 20 }}>
            {/* 节点表 */}
            <section>
              <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600 }}>节点（{nodes.length}）</h3>
              <div style={{ overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead style={{ background: "#f9fafb", color: "#374151" }}>
                    <tr>
                      <th style={th}>ID</th>
                      <th style={th}>名称</th>
                      <th style={th}>位置</th>
                      <th style={th}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((n) => (
                      <tr key={n.id} style={{ borderTop: "1px solid #e5e7eb", background: n.id === selectedNodeId ? "#eef2ff66" : undefined }}>
                        <td style={tdMono}>{n.id}</td>
                        <td style={td}>
                          <input
                            value={n.data.label}
                            onChange={(e) =>
                              setNodes((nds) => nds.map((x) => (x.id === n.id ? { ...x, data: { ...x.data, label: e.target.value } } : x)))
                            }
                            onBlur={() => setNodes((nds) => nds.slice())}
                            style={{ width: "100%", padding: "6px 8px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                          />
                        </td>
                        <td style={td}>{`(${Math.round(n.position.x)}, ${Math.round(n.position.y)})`}</td>
                        <td style={td}>
                          <button className="link" onClick={() => selectNode(n.id)}>选中</button>
                          <span> · </span>
                          <button className="link danger"
                            onClick={() => {
                              setEdges((es) => es.filter((e) => e.source !== n.id && e.target !== n.id));
                              setNodes((ns) => ns.filter((x) => x.id !== n.id));
                              if (n.id === selectedNodeId) setSelectedNodeId(null);
                            }}
                          >删除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 连线表 */}
            <section>
              <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600 }}>连线（{edges.length}）</h3>
              <div style={{ overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead style={{ background: "#f9fafb", color: "#374151" }}>
                    <tr>
                      <th style={th}>ID</th>
                      <th style={th}>From → To</th>
                      <th style={th}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {edges.map((e) => (
                      <tr key={e.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                        <td style={tdMono}>{e.id}</td>
                        <td style={td}>{e.source} → {e.target}</td>
                        <td style={td}>
                          <button className="link danger" onClick={() => setEdges((es) => es.filter((x) => x.id !== e.id))}>删除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </aside>
      </div>

      {/* 轻量样式：按钮/链接 */}
      <style>{`
        .btn {
          display:inline-flex;align-items:center;gap:6px;padding:6px 10px;
          border:1px solid #e5e7eb;border-radius:999px;background:#fff;font-size:14px;
          cursor:pointer;transition:background .15s ease;
        }
        .btn:disabled{opacity:.45;cursor:not-allowed}
        .btn:hover{background:#f8fafc}
        .link{color:#2563eb;cursor:pointer;background:none;border:none;padding:0}
        .link.danger{color:#dc2626}
        .hidden{display:none}
      `}</style>
    </div>
  );
}

/** 表格单元格小样式 */
const th: React.CSSProperties = { padding: "8px 10px", textAlign: "left" };
const td: React.CSSProperties = { padding: "6px 10px", verticalAlign: "top" };
const tdMono: React.CSSProperties = { ...td, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace", fontSize: 11 };
