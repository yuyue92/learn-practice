import React from 'react';
import Button from '../ui/Button.jsx';

function svgToPngDataUrl(svgEl, width = 1200, height = 600) {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function ChartExportButton({ chartRootRef, filename = 'chart.png' }) {
  const [loading, setLoading] = React.useState(false);

  async function onExport() {
    if (!chartRootRef?.current) return;
    setLoading(true);
    try {
      const svg = chartRootRef.current.querySelector('svg');
      if (!svg) throw new Error('未找到 SVG 图表节点');
      const rect = chartRootRef.current.getBoundingClientRect();
      const dataUrl = await svgToPngDataUrl(svg, Math.max(900, Math.floor(rect.width)), 520);
      downloadDataUrl(dataUrl, filename);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      alert(`导出失败：${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="ghost" onClick={onExport} disabled={loading}>
      {loading ? '导出中…' : '导出 PNG'}
    </Button>
  );
}
