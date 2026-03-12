'use client';

import { useState, useEffect } from 'react';
import { Download, Loader2, Package } from 'lucide-react';
import { getAdminDownloads } from '@/actions/admin';

interface DownloadRow {
  _id: string;
  userId: string;
  productId: string;
  licenseId: string;
  version: string;
  ipAddress?: string | null;
  downloadedAt: string;
}

interface DownloadWithMeta extends DownloadRow {
  userEmail?: string | null;
  productName?: string | null;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getAdminDownloads();
        if ('error' in res) throw new Error(res.error);
        setDownloads(res.downloads ?? []);
      } catch {
        const r = await fetch('/api/admin/downloads');
        if (r.ok) {
          const data = await r.json();
          setDownloads(data.downloads ?? []);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Plugin Downloads</h1>
          <p className="text-sm text-slate-500 mt-1">
            Download log — customers download the plugin when they access the Downloads page.
          </p>
        </div>

        {/* Info card */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-indigo-900">Plugin file management</h3>
              <p className="text-xs text-indigo-700 mt-1">
                Plugin files are stored per product. To update the downloadable file for a plan, edit the product
                and update the <code className="bg-indigo-100 px-1 rounded">fileUrl</code> and{' '}
                <code className="bg-indigo-100 px-1 rounded">version</code> fields on the{' '}
                <a href="/admin/products" className="underline font-medium">Products page</a>.
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading download log…
            </div>
          ) : downloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Download className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">No downloads recorded yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Version</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">IP</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {downloads.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-xs text-slate-700">{d.userEmail ?? d.userId}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-700">{d.productName ?? d.productId}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{d.version}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">{d.ipAddress ?? '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{fmt(d.downloadedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
