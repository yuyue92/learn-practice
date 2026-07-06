import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { designerReducer, initialDesignerState, type DesignerAction, type DesignerState } from "./designerReducer";

const Ctx = createContext<{
    state: DesignerState;
    dispatch: React.Dispatch<DesignerAction>;
} | null>(null);

const STORAGE_KEY = "form-designer:schema";

function loadInitialState(): DesignerState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return initialDesignerState;
        const schema = JSON.parse(raw);
        if (schema && Array.isArray(schema.rows)) {
            return { ...initialDesignerState, schema };
        }
        return initialDesignerState;
    } catch {
        return initialDesignerState;
    }
}

export function DesignerProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(designerReducer, undefined, loadInitialState);
    const value = useMemo(() => ({ state, dispatch }), [state]);

    // 暂无后端：先把 schema 落到 localStorage，避免刷新/切换菜单后表单内容丢失
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.schema));
        } catch {
            // 忽略存储异常（隐私模式/容量超限等）
        }
    }, [state.schema]);
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDesigner() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useDesigner must be used within DesignerProvider");
    return ctx;
}
