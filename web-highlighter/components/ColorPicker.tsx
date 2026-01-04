// ============================================
// 文件: components/ColorPicker.tsx
// ============================================

import { COLORS, type ColorKey } from "~types/highlight"

interface ColorPickerProps {
    selectedColor: ColorKey
    onColorChange: (color: ColorKey) => void
}

export const ColorPicker = ({ selectedColor, onColorChange }: ColorPickerProps) => {
    return (
        <div className="p-4 border-b bg-white">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                选择高亮颜色
            </label>
            <div className="grid grid-cols-6 gap-2">
                {(Object.keys(COLORS) as ColorKey[]).map(color => (
                    <button
                        key={color}
                        onClick={() => onColorChange(color)}
                        className={`
              w-full h-12 rounded-lg border-2 transition-all
              hover:scale-105 active:scale-95
              flex items-center justify-center
              ${selectedColor === color
                                ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md'
                                : 'border-gray-300 hover:border-gray-400'
                            }
            `}
                        style={{ backgroundColor: COLORS[color] }}
                        title={color}
                        aria-label={`选择 ${color} 颜色`}>
                        {selectedColor === color && (
                            <span className="text-indigo-600 text-xl">✓</span>
                        )}
                    </button>
                ))}
            </div>

            {/* 当前选择的颜色名称 */}
            <div className="mt-3 text-sm text-gray-600 text-center">
                当前选择: <span className="font-semibold capitalize">{selectedColor}</span>
            </div>
        </div>
    )
}