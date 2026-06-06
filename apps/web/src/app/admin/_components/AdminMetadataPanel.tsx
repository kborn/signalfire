import type { ReactNode } from 'react';

export type AdminMetadataPanelItem = {
  label: string;
  value: ReactNode;
  className?: string;
};

export default function AdminMetadataPanel({
  ariaLabel,
  className,
  items,
}: {
  ariaLabel: string;
  className?: string;
  items: AdminMetadataPanelItem[];
}) {
  return (
    <section
      className={['adminPanel adminMetadataPanel', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      <dl className="adminMetadataBar">
        {items.map((item) => (
          <div
            key={item.label}
            className={['adminMetadataItem', item.className].filter(Boolean).join(' ')}
          >
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
