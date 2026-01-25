import React, { useState, useCallback, useMemo } from 'react';

// ============================================================================
// Schema Types
// ============================================================================

enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  SUB_TABLE = 'subTable',
  COMPUTED = 'computed',
}

interface OptionItem { value: string; label: string; }
interface ValidationRule { maxLength?: number; minLength?: number; max?: number; min?: number; }
interface DataSchema { required: boolean; defaultValue?: unknown; validation?: ValidationRule; options?: OptionItem[]; }
interface UISchema { placeholder?: string; helpText?: string; visible?: boolean; }
interface ComputationConfig { function: 'SUM' | 'COUNT' | 'AVG'; sourceField: string; precision?: number; }

interface FieldSchema {
  fieldId: string;
  fieldKey: string;
  fieldType: FieldType;
  label: string;
  dataSchema: DataSchema;
  uiSchema: UISchema;
  children?: FieldSchema[];
  computation?: ComputationConfig;
  colspan: 2 | 3 | 4 | 6 | 12;
}

interface RuleSchema {
  ruleId: string; ruleName: string; ruleType: 'visibility' | 'required' | 'setValue';
  condition: { sourceField: string; operator: string; value: unknown };
  action: { targetField: string; actionValue: unknown };
}

interface FormSchema { formId: string; formName: string; schemaVersion: number; fields: FieldSchema[]; rules: RuleSchema[]; }
type FormData = Record<string, unknown>;

// ============================================================================
// Utils
// ============================================================================

const generateUUID = (): string => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = (Math.random() * 16) | 0;
  return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
});

const generateFieldKey = (type: FieldType, existingKeys: string[]): string => {
  let i = 1; while (existingKeys.includes(`${type}_${i}`)) i++;
  return `${type}_${i}`;
};

const getAllFieldKeys = (fields: FieldSchema[]): string[] => {
  const keys: string[] = [];
  const t = (l: FieldSchema[]) => l.forEach(f => { keys.push(f.fieldKey); if (f.children) t(f.children); });
  t(fields); return keys;
};

const createFieldSchema = (type: FieldType, existingKeys: string[]): FieldSchema => {
  const labels: Record<FieldType, string> = {
    [FieldType.TEXT]: '单行文本', [FieldType.NUMBER]: '数字', [FieldType.DATE]: '日期',
    [FieldType.RADIO]: '单选', [FieldType.CHECKBOX]: '多选',
    [FieldType.SUB_TABLE]: '子表', [FieldType.COMPUTED]: '计算字段',
  };
  const base: FieldSchema = {
    fieldId: generateUUID(),
    fieldKey: generateFieldKey(type, existingKeys),
    fieldType: type,
    label: labels[type],
    dataSchema: { required: false },
    uiSchema: { visible: true },
    colspan: 12,
  };
  if (type === FieldType.RADIO || type === FieldType.CHECKBOX) base.dataSchema.options = [{ value: 'opt1', label: '选项1' }, { value: 'opt2', label: '选项2' }];
  if (type === FieldType.SUB_TABLE) base.children = [];
  if (type === FieldType.COMPUTED) base.computation = { function: 'SUM', sourceField: '', precision: 2 };
  return base;
};

// 保存 JSON 到本地
const saveToLocal = (schema: FormSchema) => {
  const json = JSON.stringify(schema, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${schema.formName || 'form'}-v${schema.schemaVersion}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ============================================================================
// Field Registry
// ============================================================================

interface FieldDef { type: FieldType; category: string; label: string; icon: string; allowInSubTable: boolean; }
const FIELD_DEFS: FieldDef[] = [
  { type: FieldType.TEXT, category: 'basic', label: '单行文本', icon: '📝', allowInSubTable: true },
  { type: FieldType.NUMBER, category: 'basic', label: '数字', icon: '🔢', allowInSubTable: true },
  { type: FieldType.DATE, category: 'basic', label: '日期', icon: '📅', allowInSubTable: true },
  { type: FieldType.RADIO, category: 'choice', label: '单选', icon: '⭕', allowInSubTable: true },
  { type: FieldType.CHECKBOX, category: 'choice', label: '多选', icon: '☑️', allowInSubTable: true },
  { type: FieldType.SUB_TABLE, category: 'structure', label: '子表', icon: '📋', allowInSubTable: false },
  { type: FieldType.COMPUTED, category: 'logic', label: '计算字段', icon: '🧮', allowInSubTable: false },
];
const CATS = { basic: '基础字段', choice: '选择字段', structure: '结构字段', logic: '逻辑字段' };

// colspan 选项
const COLSPAN_OPTIONS: { value: FieldSchema['colspan']; label: string }[] = [
  { value: 2, label: '2/12 (16.7%)' },
  { value: 3, label: '3/12 (25%)' },
  { value: 4, label: '4/12 (33.3%)' },
  { value: 6, label: '6/12 (50%)' },
  { value: 12, label: '12/12 (100%)' },
];

// ============================================================================
// Main Component
// ============================================================================

export default function FormBuilder() {
  const [schema, setSchema] = useState<FormSchema>({
    formId: generateUUID(), formName: '未命名表单', schemaVersion: 1, fields: [], rules: [],
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<'design' | 'preview' | 'schema'>('design');

  const selectedField = useMemo(() => {
    const find = (fs: FieldSchema[]): FieldSchema | null => {
      for (const f of fs) { if (f.fieldId === selectedId) return f; if (f.children) { const x = find(f.children); if (x) return x; } }
      return null;
    };
    return selectedId ? find(schema.fields) : null;
  }, [schema.fields, selectedId]);

  const addField = useCallback((type: FieldType, parentId?: string) => {
    const keys = getAllFieldKeys(schema.fields);
    const nf = createFieldSchema(type, keys);
    setSchema(p => {
      if (parentId) {
        return { ...p, fields: p.fields.map(f => f.fieldId === parentId && f.children ? { ...f, children: [...f.children, nf] } : f) };
      }
      return { ...p, fields: [...p.fields, nf] };
    });
    setSelectedId(nf.fieldId);
  }, [schema.fields]);

  const updateField = useCallback((id: string, upd: Partial<FieldSchema>) => {
    const up = (fs: FieldSchema[]): FieldSchema[] => fs.map(f => {
      if (f.fieldId === id) return { ...f, ...upd };
      if (f.children) return { ...f, children: up(f.children) };
      return f;
    });
    setSchema(p => ({ ...p, fields: up(p.fields) }));
  }, []);

  const deleteField = useCallback((id: string) => {
    const del = (fs: FieldSchema[]): FieldSchema[] => fs.filter(f => f.fieldId !== id).map(f => f.children ? { ...f, children: del(f.children) } : f);
    setSchema(p => ({ ...p, fields: del(p.fields) }));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const moveField = useCallback((from: number, to: number) => {
    setSchema(p => {
      const nf = [...p.fields]; const [r] = nf.splice(from, 1); nf.splice(to, 0, r);
      return { ...p, fields: nf };
    });
  }, []);

  const handleSave = () => {
    const newSchema = { ...schema, schemaVersion: schema.schemaVersion + 1 };
    setSchema(newSchema);
    saveToLocal(newSchema);
  };

  return (
    <div style={S.wrap}>
      <header style={S.header}>
        <div style={S.hLeft}><span style={S.logo}>📋</span>
          <input style={S.nameInput} value={schema.formName} onChange={e => setSchema(p => ({ ...p, formName: e.target.value }))} />
        </div>
        <div style={S.tabs}>
          {(['design', 'preview', 'schema'] as const).map(t => (
            <button key={t} style={{ ...S.tab, ...(tab === t ? S.tabOn : {}) }} onClick={() => setTab(t)}>
              {t === 'design' ? '设计' : t === 'preview' ? '预览' : 'Schema'}
            </button>
          ))}
        </div>
        <div style={S.hRight}>
          <span style={S.ver}>v{schema.schemaVersion}</span>
          <button style={S.saveBtn} onClick={handleSave}>💾 保存</button>
        </div>
      </header>

      <main style={S.main}>
        {tab === 'design' && <>
          <aside style={S.left}>
            <h3 style={S.pTitle}>字段库</h3>
            {Object.entries(CATS).map(([c, l]) => (
              <div key={c} style={S.cat}>
                <div style={S.catTitle}>{l}</div>
                <div style={S.catGrid}>
                  {FIELD_DEFS.filter(f => f.category === c).map(d => (
                    <div key={d.type} style={S.fItem} onClick={() => addField(d.type)}>
                      <span style={S.fIcon}>{d.icon}</span><span>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          <section style={S.canvas}>
            {schema.fields.length === 0 ? (
              <div style={S.empty}><div style={S.emptyIcon}>📝</div><div>点击左侧字段添加</div></div>
            ) : (
              schema.fields.map((f, i) => (
                <FieldNode key={f.fieldId} field={f} idx={i} total={schema.fields.length}
                  selected={selectedId === f.fieldId} onSelect={() => setSelectedId(f.fieldId)}
                  onDelete={() => deleteField(f.fieldId)} onMove={moveField}
                  onAddSub={t => addField(t, f.fieldId)} onSelectSub={setSelectedId}
                  selectedId={selectedId} onDeleteSub={deleteField} />
              ))
            )}
          </section>

          <aside style={S.right}>
            <h3 style={S.pTitle}>属性配置</h3>
            {selectedField ? <PropEditor field={selectedField} allFields={schema.fields} onChange={u => updateField(selectedField.fieldId, u)} />
              : <div style={S.emptyProp}>选择字段进行配置</div>}
          </aside>
        </>}

        {tab === 'preview' && <Preview schema={schema} />}
        {tab === 'schema' && <pre style={S.code}>{JSON.stringify(schema, null, 2)}</pre>}
      </main>
    </div>
  );
}

// ============================================================================
// Field Node
// ============================================================================

function FieldNode({ field: f, idx, total, selected, onSelect, onDelete, onMove, onAddSub, onSelectSub, selectedId, onDeleteSub }: {
  field: FieldSchema; idx: number; total: number; selected: boolean;
  onSelect: () => void; onDelete: () => void; onMove: (f: number, t: number) => void;
  onAddSub: (t: FieldType) => void; onSelectSub: (id: string) => void; selectedId: string | null; onDeleteSub: (id: string) => void;
}) {
  const d = FIELD_DEFS.find(x => x.type === f.fieldType);
  return (
    <div style={{ ...S.node, ...(selected ? S.nodeOn : {}) }} onClick={onSelect}>
      <div style={S.nodeHead}>
        <span style={S.nodeIcon}>{d?.icon}</span>
        <span style={S.nodeLabel}>{f.label}</span>
        <span style={S.nodeKey}>{f.fieldKey}</span>
        <span style={S.colspanBadge}>{f.colspan}/12</span>
        {f.dataSchema.required && <span style={S.reqBadge}>必填</span>}
        <div style={S.nodeActs}>
          <button style={S.actBtn} onClick={e => { e.stopPropagation(); onMove(idx, Math.max(0, idx - 1)); }} disabled={idx === 0}>↑</button>
          <button style={S.actBtn} onClick={e => { e.stopPropagation(); onMove(idx, Math.min(total - 1, idx + 1)); }} disabled={idx === total - 1}>↓</button>
          <button style={S.delBtn} onClick={e => { e.stopPropagation(); onDelete(); }}>✕</button>
        </div>
      </div>
      {f.fieldType === FieldType.SUB_TABLE && (
        <div style={S.subWrap}>
          <div style={S.subHead}>
            <span>子表字段</span>
            <div>{FIELD_DEFS.filter(x => x.allowInSubTable).slice(0, 3).map(x => (
              <button key={x.type} style={S.addSubBtn} onClick={e => { e.stopPropagation(); onAddSub(x.type); }}>{x.icon}</button>
            ))}</div>
          </div>
          {f.children?.length ? (
            <div style={S.subList}>{f.children.map(c => {
              const cd = FIELD_DEFS.find(x => x.type === c.fieldType);
              return (
                <div key={c.fieldId} style={{ ...S.subItem, ...(selectedId === c.fieldId ? S.subItemOn : {}) }}
                  onClick={e => { e.stopPropagation(); onSelectSub(c.fieldId); }}>
                  <span>{cd?.icon}</span><span>{c.label}</span>
                  <button style={S.subDel} onClick={e => { e.stopPropagation(); onDeleteSub(c.fieldId); }}>✕</button>
                </div>
              );
            })}</div>
          ) : <div style={S.subEmpty}>点击按钮添加字段</div>}
        </div>
      )}
      {f.fieldType === FieldType.COMPUTED && f.computation && (
        <div style={S.compInfo}>{f.computation.function}({f.computation.sourceField || '未配置'})</div>
      )}
    </div>
  );
}

// ============================================================================
// Property Editor
// ============================================================================

function PropEditor({ field: f, allFields, onChange }: { field: FieldSchema; allFields: FieldSchema[]; onChange: (u: Partial<FieldSchema>) => void }) {
  const upData = (u: Partial<DataSchema>) => onChange({ dataSchema: { ...f.dataSchema, ...u } });
  const upUI = (u: Partial<UISchema>) => onChange({ uiSchema: { ...f.uiSchema, ...u } });
  const upComp = (u: Partial<ComputationConfig>) => f.computation && onChange({ computation: { ...f.computation, ...u } });

  const subOpts = useMemo(() => {
    const o: OptionItem[] = [];
    allFields.forEach(x => {
      if (x.fieldType === FieldType.SUB_TABLE && x.children) {
        x.children.forEach(c => { if (c.fieldType === FieldType.NUMBER) o.push({ value: `${x.fieldKey}.${c.fieldKey}`, label: `${x.label}/${c.label}` }); });
      }
    });
    return o;
  }, [allFields]);

  return (
    <div style={S.propWrap}>
      <div style={S.sec}><div style={S.secTitle}>基础信息</div>
        <div style={S.row}><label style={S.lbl}>标题</label><input style={S.inp} value={f.label} onChange={e => onChange({ label: e.target.value })} /></div>
        <div style={S.row}><label style={S.lbl}>标识</label><input style={S.inp} value={f.fieldKey} disabled /></div>
      </div>

      <div style={S.sec}><div style={S.secTitle}>约束</div>
        <label style={S.chk}><input type="checkbox" checked={f.dataSchema.required} onChange={e => upData({ required: e.target.checked })} /> 必填</label>
      </div>

      {(f.fieldType === FieldType.RADIO || f.fieldType === FieldType.CHECKBOX) && (
        <div style={S.sec}><div style={S.secTitle}>选项</div>
          {f.dataSchema.options?.map((o, i) => (
            <div key={i} style={S.optRow}>
              <input style={S.optInp} value={o.label} onChange={e => {
                const opts = [...(f.dataSchema.options || [])];
                opts[i] = { ...o, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') };
                upData({ options: opts });
              }} />
              <button style={S.optDel} onClick={() => upData({ options: f.dataSchema.options?.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
          <button style={S.addOpt} onClick={() => upData({ options: [...(f.dataSchema.options || []), { value: `opt${(f.dataSchema.options?.length || 0) + 1}`, label: `选项${(f.dataSchema.options?.length || 0) + 1}` }] })}>+ 添加选项</button>
        </div>
      )}

      {f.fieldType === FieldType.COMPUTED && f.computation && (
        <div style={S.sec}><div style={S.secTitle}>计算配置</div>
          <div style={S.row}><label style={S.lbl}>函数</label>
            <select style={S.sel} value={f.computation.function} onChange={e => upComp({ function: e.target.value as 'SUM' | 'COUNT' | 'AVG' })}>
              <option value="SUM">SUM 求和</option><option value="COUNT">COUNT 计数</option><option value="AVG">AVG 平均</option>
            </select>
          </div>
          <div style={S.row}><label style={S.lbl}>数据源</label>
            <select style={S.sel} value={f.computation.sourceField} onChange={e => upComp({ sourceField: e.target.value })}>
              <option value="">选择子表字段...</option>
              {subOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      )}

      <div style={S.sec}><div style={S.secTitle}>布局</div>
        <div style={S.row}>
          <label style={S.lbl}>栅格宽度</label>
          <select
            style={S.sel}
            value={f.colspan}
            onChange={e => onChange({ colspan: Number(e.target.value) as FieldSchema['colspan'] })}
          >
            {COLSPAN_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={S.sec}><div style={S.secTitle}>高级</div>
        <div style={S.row}><label style={S.lbl}>占位符</label><input style={S.inp} value={f.uiSchema.placeholder || ''} onChange={e => upUI({ placeholder: e.target.value })} /></div>
        <div style={S.row}><label style={S.lbl}>帮助文字</label><input style={S.inp} value={f.uiSchema.helpText || ''} onChange={e => upUI({ helpText: e.target.value })} /></div>
      </div>
    </div>
  );
}

// ============================================================================
// Preview - 使用 12 栅格系统
// ============================================================================

function Preview({ schema }: { schema: FormSchema }) {
  const [data, setData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const change = (k: string, v: unknown) => setData(p => ({ ...p, [k]: v }));

  const submit = () => {
    const errs: Record<string, string> = {};
    schema.fields.forEach(f => {
      if (f.dataSchema.required) {
        const v = data[f.fieldKey];
        if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
          errs[f.fieldKey] = '此字段为必填';
        }
      }
    });
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      alert('✅ 提交成功！\n\n' + JSON.stringify(data, null, 2));
    }
  };

  const compute = (f: FieldSchema): number => {
    if (!f.computation?.sourceField) return 0;
    const [tableKey, fieldKey] = f.computation.sourceField.split('.');
    const rows = data[tableKey] as FormData[] || [];
    const values = rows.map(r => Number(r[fieldKey]) || 0);
    if (f.computation.function === 'SUM') return values.reduce((a, b) => a + b, 0);
    if (f.computation.function === 'COUNT') return values.filter(v => v !== 0).length;
    if (f.computation.function === 'AVG') return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    return 0;
  };

  // 将字段按行分组，每行 colspan 总和不超过 12
  const groupFieldsIntoRows = (fields: FieldSchema[]): FieldSchema[][] => {
    const rows: FieldSchema[][] = [];
    let currentRow: FieldSchema[] = [];
    let currentSpan = 0;

    fields.forEach(f => {
      const colspan = f.colspan || 12;
      
      // 子表和计算字段始终独占一行
      if (f.fieldType === FieldType.SUB_TABLE || f.fieldType === FieldType.COMPUTED) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
          currentRow = [];
          currentSpan = 0;
        }
        rows.push([f]);
        return;
      }

      // 如果当前行加上这个字段会超过 12，则换行
      if (currentSpan + colspan > 12) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [f];
        currentSpan = colspan;
      } else {
        currentRow.push(f);
        currentSpan += colspan;
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const renderField = (f: FieldSchema, isInRow: boolean = false) => {
    const v = data[f.fieldKey];
    const err = errors[f.fieldKey];
    
    // 计算宽度百分比，留出间距
    const widthPercent = (f.colspan / 12) * 100;
    const fieldStyle: React.CSSProperties = {
      ...S.pField,
      width: isInRow ? `calc(${widthPercent}% - 8px)` : '100%',
      flexShrink: 0,
    };

    if (f.fieldType === FieldType.SUB_TABLE) {
      const rows = (v as FormData[]) || [];
      return (
        <div key={f.fieldId} style={{ ...fieldStyle, width: '100%' }}>
          <label style={S.pLbl}>{f.label}{f.dataSchema.required && <span style={S.pReq}>*</span>}</label>
          <table style={S.table}>
            <thead style={S.tHead}>
              <tr>{f.children?.map(c => <th key={c.fieldId} style={S.th}>{c.label}</th>)}<th style={S.th}>操作</th></tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={S.tRow}>
                  {f.children?.map(c => (
                    <td key={c.fieldId} style={S.td}>
                      <input style={S.tInp} type={c.fieldType === FieldType.NUMBER ? 'number' : c.fieldType === FieldType.DATE ? 'date' : 'text'}
                        value={(row[c.fieldKey] as string) || ''} onChange={e => {
                          const newRows = [...rows]; newRows[ri] = { ...newRows[ri], [c.fieldKey]: e.target.value };
                          change(f.fieldKey, newRows);
                        }} />
                    </td>
                  ))}
                  <td style={S.td}><button style={S.tDel} onClick={() => change(f.fieldKey, rows.filter((_, i) => i !== ri))}>删除</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={S.addRowBtn} onClick={() => {
            const newRow: FormData = {}; f.children?.forEach(c => { newRow[c.fieldKey] = ''; });
            change(f.fieldKey, [...rows, newRow]);
          }}>+ 添加行</button>
          {err && <div style={S.pErr}>{err}</div>}
        </div>
      );
    }

    if (f.fieldType === FieldType.COMPUTED) {
      return (
        <div key={f.fieldId} style={{ ...fieldStyle, width: '100%' }}>
          <label style={S.pLbl}>{f.label}</label>
          <div style={S.compVal}>{compute(f).toFixed(f.computation?.precision ?? 2)}</div>
        </div>
      );
    }

    return (
      <div key={f.fieldId} style={fieldStyle}>
        <label style={S.pLbl}>{f.label}{f.dataSchema.required && <span style={S.pReq}>*</span>}</label>
        {f.fieldType === FieldType.TEXT && <input style={{ ...S.pInp, ...(err ? S.pInpErr : {}) }} value={v as string || ''} onChange={e => change(f.fieldKey, e.target.value)} placeholder={f.uiSchema.placeholder} />}
        {f.fieldType === FieldType.NUMBER && <input type="number" style={{ ...S.pInp, ...(err ? S.pInpErr : {}) }} value={v as string || ''} onChange={e => change(f.fieldKey, e.target.value)} placeholder={f.uiSchema.placeholder} />}
        {f.fieldType === FieldType.DATE && <input type="date" style={{ ...S.pInp, ...(err ? S.pInpErr : {}) }} value={v as string || ''} onChange={e => change(f.fieldKey, e.target.value)} />}
        {f.fieldType === FieldType.RADIO && <div style={S.opts}>{f.dataSchema.options?.map(o => (
          <label key={o.value} style={S.optLbl}><input type="radio" name={f.fieldKey} value={o.value} checked={v === o.value} onChange={() => change(f.fieldKey, o.value)} /> {o.label}</label>
        ))}</div>}
        {f.fieldType === FieldType.CHECKBOX && <div style={S.opts}>{f.dataSchema.options?.map(o => (
          <label key={o.value} style={S.optLbl}><input type="checkbox" checked={(v as string[] || []).includes(o.value)} onChange={e => {
            const arr = v as string[] || [];
            change(f.fieldKey, e.target.checked ? [...arr, o.value] : arr.filter(x => x !== o.value));
          }} /> {o.label}</label>
        ))}</div>}
        {f.uiSchema.helpText && <div style={S.pHelp}>{f.uiSchema.helpText}</div>}
        {err && <div style={S.pErr}>{err}</div>}
      </div>
    );
  };

  const rows = groupFieldsIntoRows(schema.fields);

  return (
    <div style={S.prevWrap}>
      <div style={S.prevCard}>
        <h2 style={S.prevTitle}>{schema.formName}</h2>
        <div style={S.prevFields}>
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} style={S.prevRow}>
              {row.map(f => renderField(f, row.length > 1 || f.colspan < 12))}
            </div>
          ))}
        </div>
        <button style={S.submitBtn} onClick={submit}>提交</button>
      </div>
    </div>
  );
}

// ============================================================================
// Styles
// ============================================================================

const S: Record<string, React.CSSProperties> = {
  wrap: { display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f5f7', color: '#1d1d1f', fontFamily: '"SF Pro Display", -apple-system, sans-serif' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#fff', borderBottom: '1px solid #e5e5e7' },
  hLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  logo: { fontSize: 24 },
  nameInput: { background: 'transparent', border: 'none', color: '#1d1d1f', fontSize: 18, fontWeight: 600, outline: 'none', width: 200 },
  tabs: { display: 'flex', gap: 4 },
  tab: { padding: '8px 20px', background: 'transparent', border: 'none', color: '#86868b', cursor: 'pointer', borderRadius: 6, fontSize: 14, transition: 'all .2s' },
  tabOn: { background: '#e8e8ed', color: '#1d1d1f' },
  hRight: { display: 'flex', alignItems: 'center', gap: 12 },
  ver: { padding: '4px 10px', background: '#e8e8ed', borderRadius: 12, fontSize: 12, color: '#86868b' },
  saveBtn: { padding: '8px 20px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 500 },

  main: { display: 'flex', flex: 1, overflow: 'hidden' },
  left: { width: 240, background: '#fff', borderRight: '1px solid #e5e5e7', padding: 16, overflowY: 'auto' },
  right: { width: 300, background: '#fff', borderLeft: '1px solid #e5e5e7', padding: 16, overflowY: 'auto' },
  canvas: { flex: 1, padding: 24, overflowY: 'auto', background: '#f5f5f7' },
  pTitle: { fontSize: 13, fontWeight: 600, color: '#86868b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },

  cat: { marginBottom: 20 },
  catTitle: { fontSize: 12, color: '#86868b', marginBottom: 8 },
  catGrid: { display: 'flex', flexDirection: 'column', gap: 4 },
  fItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f5f5f7', borderRadius: 8, cursor: 'pointer', transition: 'all .15s' },
  fIcon: { fontSize: 16 },

  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#86868b' },
  emptyIcon: { fontSize: 48, marginBottom: 16, opacity: 0.5 },
  emptyProp: { padding: 20, textAlign: 'center', color: '#86868b' },

  node: { background: '#fff', borderRadius: 12, marginBottom: 12, borderWidth: 2, borderStyle: 'solid', borderColor: '#e5e5e7', transition: 'all .15s', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.08)' },
  nodeOn: { borderColor: '#6366f1', boxShadow: '0 0 0 4px rgba(99,102,241,.15)' },
  nodeHead: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', cursor: 'pointer' },
  nodeIcon: { fontSize: 18 },
  nodeLabel: { fontWeight: 500, flex: 1 },
  nodeKey: { fontSize: 12, color: '#86868b', fontFamily: 'monospace', background: '#f5f5f7', padding: '2px 6px', borderRadius: 4 },
  colspanBadge: { fontSize: 11, color: '#6366f1', background: '#e8e8ff', padding: '2px 6px', borderRadius: 4, fontWeight: 500 },
  reqBadge: { padding: '2px 8px', background: '#ef4444', color: '#fff', borderRadius: 4, fontSize: 10, fontWeight: 600 },
  nodeActs: { display: 'flex', gap: 4 },
  actBtn: { width: 24, height: 24, background: '#f5f5f7', border: 'none', borderRadius: 4, color: '#86868b', cursor: 'pointer' },
  delBtn: { width: 24, height: 24, background: '#f5f5f7', border: 'none', borderRadius: 4, color: '#ef4444', cursor: 'pointer' },

  subWrap: { background: '#f5f5f7', margin: '0 12px 12px', borderRadius: 8, padding: 12 },
  subHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  addSubBtn: { width: 28, height: 28, background: '#fff', border: '1px solid #e5e5e7', borderRadius: 6, cursor: 'pointer', marginLeft: 4 },
  subList: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  subItem: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#fff', borderRadius: 6, fontSize: 13, cursor: 'pointer', borderWidth: 1, borderStyle: 'solid', borderColor: '#e5e5e7' },
  subItemOn: { borderColor: '#6366f1' },
  subDel: { width: 18, height: 18, background: 'transparent', border: 'none', color: '#86868b', cursor: 'pointer', padding: 0 },
  subEmpty: { fontSize: 12, color: '#86868b', textAlign: 'center', padding: 12 },
  compInfo: { padding: '8px 16px', fontSize: 13, color: '#86868b', fontFamily: 'monospace', background: '#f5f5f7', margin: '0 12px 12px', borderRadius: 6 },

  propWrap: { display: 'flex', flexDirection: 'column', gap: 16 },
  sec: { background: '#f5f5f7', borderRadius: 10, padding: 14 },
  secTitle: { fontSize: 12, fontWeight: 600, color: '#86868b', marginBottom: 12, textTransform: 'uppercase' },
  row: { marginBottom: 10 },
  lbl: { display: 'block', fontSize: 12, color: '#86868b', marginBottom: 6 },
  inp: { width: '100%', padding: '8px 10px', background: '#fff', border: '1px solid #d2d2d7', borderRadius: 6, color: '#1d1d1f', fontSize: 13, outline: 'none' },
  sel: { width: '100%', padding: '8px 10px', background: '#fff', border: '1px solid #d2d2d7', borderRadius: 6, color: '#1d1d1f', fontSize: 13 },
  chk: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1d1d1f', cursor: 'pointer' },
  optRow: { display: 'flex', gap: 6, marginBottom: 6 },
  optInp: { flex: 1, padding: '6px 8px', background: '#fff', border: '1px solid #d2d2d7', borderRadius: 4, color: '#1d1d1f', fontSize: 12 },
  optDel: { width: 24, height: 24, background: '#e8e8ed', border: 'none', borderRadius: 4, color: '#86868b', cursor: 'pointer' },
  addOpt: { width: '100%', padding: '6px', background: 'transparent', border: '1px dashed #d2d2d7', borderRadius: 4, color: '#86868b', cursor: 'pointer', fontSize: 12 },
  widths: { display: 'flex', gap: 6 },
  wBtn: { flex: 1, padding: '8px', background: '#fff', borderWidth: 1, borderStyle: 'solid', borderColor: '#d2d2d7', borderRadius: 6, color: '#86868b', cursor: 'pointer', fontSize: 12 },
  wBtnOn: { borderColor: '#6366f1', color: '#6366f1' },

  prevWrap: { flex: 1, display: 'flex', justifyContent: 'center', padding: 40, overflowY: 'auto' },
  prevCard: { width: '100%', maxWidth: 800, background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,.08)' },
  prevTitle: { fontSize: 24, fontWeight: 600, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #e5e5e7' },
  prevFields: { display: 'flex', flexDirection: 'column', gap: 16 },
  prevRow: { display: 'flex', flexWrap: 'wrap', gap: 8, width: '100%' },
  pField: { marginBottom: 0 },
  pLbl: { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#1d1d1f' },
  pReq: { color: '#ef4444', marginLeft: 4 },
  pInp: { width: '100%', padding: '10px 12px', background: '#fff', border: '1px solid #d2d2d7', borderRadius: 8, color: '#1d1d1f', fontSize: 14, boxSizing: 'border-box' },
  pInpErr: { borderColor: '#ef4444' },
  pHelp: { fontSize: 12, color: '#86868b', marginTop: 4 },
  pErr: { fontSize: 12, color: '#ef4444', marginTop: 4 },
  opts: { display: 'flex', flexWrap: 'wrap', gap: 12 },
  optLbl: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#1d1d1f', cursor: 'pointer' },
  compVal: { padding: '10px 12px', background: '#f5f5f7', borderRadius: 8, fontSize: 18, fontWeight: 600, color: '#6366f1' },
  submitBtn: { marginTop: 24, width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer' },

  table: { width: '100%', borderCollapse: 'collapse', marginBottom: 12, background: '#fff' },
  tHead: { background: '#f5f5f7' },
  th: { padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 500, color: '#86868b', borderBottom: '1px solid #e5e5e7' },
  tRow: { borderBottom: '1px solid #e5e5e7' },
  td: { padding: '8px 12px' },
  tInp: { width: '100%', padding: '6px 8px', background: '#fff', border: '1px solid #d2d2d7', borderRadius: 4, color: '#1d1d1f', fontSize: 13, boxSizing: 'border-box' },
  tDel: { padding: '4px 8px', background: '#f5f5f7', border: 'none', borderRadius: 4, color: '#ef4444', cursor: 'pointer', fontSize: 12 },
  addRowBtn: { padding: '8px 16px', background: 'transparent', border: '1px dashed #d2d2d7', borderRadius: 6, color: '#86868b', cursor: 'pointer', fontSize: 13 },

  code: { flex: 1, margin: 24, padding: 24, background: '#fff', borderRadius: 12, overflow: 'auto', fontSize: 12, lineHeight: 1.6, color: '#1d1d1f', fontFamily: '"SF Mono", monospace', border: '1px solid #e5e5e7' },
};