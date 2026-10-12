// Skeleton placeholders shown while an admin page loads its data. Sizes come from CSS classes
// (the Content-Security-Policy blocks inline styles), and the shimmer stops for reduced-motion users.

type Width = 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

function Bone({ kind = "text", w }: { kind?: "text" | "title" | "figure" | "icon" | "thumb" | "button" | "chip" | "chart" | "photo"; w?: Width }) {
  return <span className={`ngd-skel is-${kind}${w ? ` w-${w}` : ""}`} />;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const WIDTHS: Width[] = [70, 50, 90, 60, 80, 40];

function Busy({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`ngd-skeleton ${className}`} role="status" aria-busy="true" aria-label={label}>
      {children}
    </div>
  );
}

export function SkeletonHead({ chip = false }: { chip?: boolean }) {
  return (
    <div className="ngd-page-head">
      <div className="ngd-skel-stack"><Bone kind="title" w={30} /><Bone w={60} /></div>
      {chip ? <Bone kind="chip" /> : null}
    </div>
  );
}

export function SkeletonKpis({ n = 4 }: { n?: number }) {
  return (
    <div className="ngd-kpis">
      {range(n).map(i => (
        <div className="ngd-card ngd-kpi" key={i}>
          <div className="ngd-skel-stack"><Bone w={50} /><Bone kind="figure" w={70} /><Bone w={80} /></div>
          <Bone kind="icon" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ lines = 4, title = true }: { lines?: number; title?: boolean }) {
  return (
    <div className="ngd-card">
      {title ? <Bone kind="title" w={40} /> : null}
      <div className="ngd-skel-stack">{range(lines).map(i => <Bone key={i} w={WIDTHS[i % WIDTHS.length]} />)}</div>
    </div>
  );
}

export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="ngd-card">
      <Bone kind="title" w={40} />
      {range(rows).map(i => (
        <div className="ngd-skel-row" key={i}>
          <Bone kind="thumb" />
          <div className="ngd-skel-stack"><Bone w={WIDTHS[i % WIDTHS.length]} /><Bone w={40} /></div>
          <Bone kind="button" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 8, cols = 6, filters = true }: { rows?: number; cols?: number; filters?: boolean }) {
  return (
    <div className="ngd-card">
      <Bone kind="title" w={20} />
      {filters ? <div className="ngd-skel-chips">{range(5).map(i => <Bone kind="chip" key={i} />)}</div> : null}
      <div className="ngd-skel-table">
        {range(rows).map(r => (
          <div className="ngd-skel-tr" key={r}>
            {range(cols).map(c => <Bone key={c} w={WIDTHS[(r + c) % WIDTHS.length]} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Dashboard at /admin. */
export function DashboardSkeleton() {
  return (
    <Busy label="Loading dashboard">
      <div className="ngd-hero is-skeleton">
        <div className="ngd-skel-stack"><Bone w={20} /><Bone kind="title" w={50} /><Bone w={70} /></div>
        <div className="ngd-skel-chips"><Bone kind="button" /><Bone kind="button" /><Bone kind="button" /></div>
      </div>
      <SkeletonKpis />
      <div className="ngd-dash">
        <div className="ngd-dash-main">
          <div className="ngd-duo"><SkeletonList /><SkeletonCard lines={6} /></div>
          <SkeletonTable rows={5} cols={5} filters={false} />
        </div>
        <aside className="ngd-dash-rail"><SkeletonCard lines={5} /><SkeletonCard lines={6} /></aside>
      </div>
    </Busy>
  );
}

/** Listings, Reports, Messages: a heading and a filtered table. */
export function TablePageSkeleton() {
  return (
    <Busy label="Loading">
      <SkeletonHead chip />
      <SkeletonTable rows={9} />
    </Busy>
  );
}

/** Payments and Data bundles: figures, then a chart or table. */
export function SalesPageSkeleton() {
  return (
    <Busy label="Loading sales">
      <SkeletonHead />
      <SkeletonKpis />
      <div className="ngd-card"><Bone kind="title" w={30} /><Bone kind="chart" /></div>
      <SkeletonTable rows={6} />
    </Busy>
  );
}

/** A single listing's review page. */
export function ListingDetailSkeleton() {
  return (
    <Busy label="Loading listing">
      <SkeletonHead chip />
      <SkeletonCard lines={5} />
      <div className="ngd-card">
        <Bone kind="title" w={20} />
        <div className="ngd-skel-photos">{range(6).map(i => <Bone kind="photo" key={i} />)}</div>
      </div>
      <div className="ngd-trio"><SkeletonCard lines={6} /><SkeletonCard lines={6} /><SkeletonCard lines={6} /></div>
    </Busy>
  );
}

export function SettingsSkeleton() {
  return (
    <Busy label="Loading settings">
      <SkeletonHead />
      <div className="ngd-duo"><SkeletonCard lines={6} /><SkeletonCard lines={6} /></div>
      <SkeletonTable rows={4} cols={4} filters={false} />
    </Busy>
  );
}
