import { useMemo, useState } from "react";
import Highlighter from './Highlighter.jsx'

/** Demo area below (can be dropped into your app). */
export default function DemoHighlighter() {
    const [q, setQ] = useState("");
    const [mode, setMode] = useState("any");
    const [wholeWord, setWholeWord] = useState(false);

    const list = [
        "React makes it painless to create interactive UIs.",
        "Design simple views for each state in your application.",
        "Build encapsulated components that manage their own state.",
        "Highlighting search results should be straightforward.",
        "Use keys to help React identify which items have changed.",
        "Regex special chars like . * ? + should be safe.",
    ];

    const queries = useMemo(() => {
        if (!q.trim()) return [];
        if (mode === "any") return q.split(/\s+/).filter(Boolean);
        return [q]; // phrase mode
    }, [q, mode]);

    return (
        <div className="min-h-screen w-full flex items-start justify-center p-6 bg-gray-50 text-gray-900">
            <div className="w-full max-w-3xl space-y-4">
                <header className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Highlighting search results</h1>
                    <p className="text-sm text-gray-600">通用高亮组件：支持多关键词、大小写、整词匹配、render prop 自定义。</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="输入要高亮的关键词（支持空格分词）"
                        className="md:col-span-2 border rounded-xl px-3 py-2 outline-none focus:ring w-full"
                    />
                    <div className="flex gap-2 items-center text-sm">
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="radio"
                                name="mode"
                                checked={mode === "any"}
                                onChange={() => setMode("any")}
                            />
                            <span>任一词</span>
                        </label>
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="radio"
                                name="mode"
                                checked={mode === "phrase"}
                                onChange={() => setMode("phrase")}
                            />
                            <span>整句</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={wholeWord} onChange={(e) => setWholeWord(e.target.checked)} />
                        整词匹配
                    </label>
                    <span className="text-gray-500">（大小写不敏感，可在组件上切换）</span>
                </div>

                <section className="bg-white rounded-2xl shadow p-4 divide-y">
                    {list.map((line, idx) => (
                        <div key={idx} className="py-3">
                            <Highlighter
                                text={line}
                                queries={queries}
                                autoEscape
                                caseSensitive={false}
                                wordBoundary={wholeWord}
                                highlightClassName="bg-yellow-200/80 px-1 rounded"
                            />
                        </div>
                    ))}
                </section>

                <section className="bg-white rounded-2xl shadow p-4 space-y-2">
                    <h2 className="font-semibold">使用方式</h2>
                    <pre className="text-xs overflow-auto p-3 bg-gray-100 rounded">
                        {`import { Highlighter } from './Highlighter';

<Highlighter
  text="React makes it painless to create interactive UIs."
  queries={["react", "ui"]}
  autoEscape
  caseSensitive={false}
  wordBoundary={true}
  markTag="mark"
  highlightClassName="bg-yellow-200 rounded px-0.5"
/>`}
                    </pre>
                    <p className="text-sm text-gray-600">也可以用 <code>renderMark</code> 自定义高亮，如带 tooltip：</p>
                    <pre className="text-xs overflow-auto p-3 bg-gray-100 rounded">
                        {`<Highlighter
  text={text}
  query={q}
  renderMark={(s, i) => (
    <span key={i} title={s} style={{ background: '#FEF08A', borderRadius: 4, padding: '0 2px' }}>{s}</span>
  )}
/>`}
                    </pre>
                </section>
            </div>
        </div>
    );
}
