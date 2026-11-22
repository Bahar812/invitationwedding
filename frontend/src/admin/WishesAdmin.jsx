import { useEffect, useState } from 'react';
import { api } from './api.js';

export default function WishesAdmin() {
  const [list, setList] = useState([]);
  const load = () => api('/admin/wishes').then((j) => setList(j.data));
  useEffect(() => { load(); }, []);

  const remove = async (w) => {
    if (!confirm('Hapus ucapan ini?')) return;
    await api(`/admin/wishes/${w.id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="ad-card">
      <h3>Ucapan & Doa ({list.length})</h3>
      <div className="ad-list">
        {list.map((w) => (
          <div className="ad-item" key={w.id}>
            <div className="grow">
              <b>{w.name}</b> <span className={`tag ${w.attendance}`}>{w.attendance === 'hadir' ? 'Hadir' : 'Tidak hadir'}</span>
              <p>{w.message}</p>
              <small>{new Date(w.createdAt).toLocaleString('id-ID')}</small>
            </div>
            <button className="ad-btn danger sm" onClick={() => remove(w)}>Hapus</button>
          </div>
        ))}
        {!list.length && <p className="ad-hint">Belum ada ucapan.</p>}
      </div>
    </div>
  );
}
