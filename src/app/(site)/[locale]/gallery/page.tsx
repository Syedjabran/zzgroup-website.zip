import { createClient } from '@/lib/supabase-server';
import { isLocale, type Locale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Project Gallery' };

export default async function Gallery({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ur = (locale as Locale) === 'ur';
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('gallery_projects').select('id, title_en, title_ur, city, project_type')
    .eq('published', true).order('display_order');

  return (
    <div className="container" style={{ paddingBlock: '2.5rem' }}>
      <h1 style={{ color: 'var(--deep-blue)' }}>{ur ? 'پراجیکٹ گیلری' : 'Project Gallery'}</h1>
      {(!projects || projects.length === 0) ? (
        <p style={{ color: 'var(--grey)' }}>{ur ? 'جلد ہی پراجیکٹس شامل کیے جائیں گے۔' : 'Project images are being added. Please check back soon.'}</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', marginTop: '1rem' }}>
          {projects.map((p: any) => (
            <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ background: 'var(--bg-soft)', aspectRatio: '4/3', display: 'grid', placeItems: 'center', color: 'var(--grey)' }}>{ur ? 'تصویر' : 'Image'}</div>
              <div style={{ padding: '.75rem' }}>
                <strong>{ur && p.title_ur ? p.title_ur : p.title_en}</strong>
                {p.city && <p style={{ color: 'var(--grey)', fontSize: '.85rem', margin: '.25rem 0 0' }}>{p.city}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
