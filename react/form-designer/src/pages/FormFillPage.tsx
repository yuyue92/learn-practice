import { useDesigner } from "../state/designerContext";
import { FormRuntime } from "../renderer/FormRuntime";

export function FormFillPage() {
    const { state } = useDesigner();
    const hasContent = state.schema.rows.length > 0;

    return (
        <div className="h-full min-h-0 overflow-y-auto bg-slate-50 p-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-4">
                    <div className="text-lg font-semibold text-slate-900">表单预览与填写</div>
                    <div className="mt-1 text-sm text-slate-500">
                        当前展示的是管理员在「表单设计器」中最新保存的表单，填写完成后可在下方查看 values。
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    {hasContent ? (
                        <FormRuntime schema={state.schema} />
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                            管理员尚未设计任何表单内容，请稍后再来查看。
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}