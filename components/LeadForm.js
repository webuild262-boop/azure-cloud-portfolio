import { useState } from 'react';

export default function LeadForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" placeholder="Your Name" className="p-3 rounded bg-slate-700 text-white border border-slate-600" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      <input type="email" placeholder="Work Email" className="p-3 rounded bg-slate-700 text-white border border-slate-600" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <button type="submit" disabled={status === 'submitting'} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded">{status === 'submitting' ? 'Scheduling...' : 'Schedule Audit'}</button>
      {status === 'success' && <p className="text-green-400 text-sm">Thanks! We will be in touch shortly.</p>}
      {status === 'error' && <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>}
    </form>
  );
}
