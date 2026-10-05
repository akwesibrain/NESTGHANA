"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";

type AdminCardProps = {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
};

export function AdminCard({ children, className = "", labelledBy }: AdminCardProps) {
  return (
    <section aria-labelledby={labelledBy} className={`admin-ui-card ${className}`.trim()}>
      {children}
    </section>
  );
}

type AdminBadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

export function AdminBadge({ children, tone = "neutral" }: AdminBadgeProps) {
  return <span className={`admin-ui-badge admin-ui-badge-${tone}`}>{children}</span>;
}

type AdminStatTileProps = {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  tone?: "blue" | "gold" | "green" | "purple" | "red";
  note?: ReactNode;
};

export function AdminStatTile({ label, value, icon, tone = "blue", note }: AdminStatTileProps) {
  return (
    <article className="admin-ui-stat">
      <span aria-hidden="true" className={`admin-ui-stat-icon admin-ui-stat-icon-${tone}`}>{icon}</span>
      <span className="admin-ui-stat-label">{label}</span>
      <strong className="admin-ui-stat-value">{value}</strong>
      {note ? <span className="admin-ui-stat-note">{note}</span> : null}
    </article>
  );
}

type AdminProgressBarProps = {
  label: string;
  value: number;
  max: number;
  tone?: "blue" | "green" | "gold";
};

export function AdminProgressBar({ label, value, max, tone = "blue" }: AdminProgressBarProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 0;
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const percentage = safeMax ? Math.min(100, Math.round((safeValue / safeMax) * 100)) : 0;

  return (
    <div
      aria-label={`${label}: ${percentage}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={percentage}
      className={`admin-ui-progress admin-ui-progress-${tone}`}
      role="progressbar"
    >
      <span className="admin-ui-progress-label">{label}</span>
      <span aria-hidden="true" className="admin-ui-progress-track">
        <span className="admin-ui-progress-fill" style={{ width: `${percentage}%` }} />
      </span>
      <span className="admin-ui-progress-value">{percentage}%</span>
    </div>
  );
}

type AdminSkeletonProps = {
  className?: string;
  rows?: number;
};

export function AdminSkeleton({ className = "", rows = 1 }: AdminSkeletonProps) {
  return (
    <div aria-hidden="true" className={`admin-ui-skeleton-group ${className}`.trim()}>
      {Array.from({ length: Math.max(1, rows) }, (_, index) => (
        <span className="admin-ui-skeleton" key={index} />
      ))}
    </div>
  );
}

type AdminEmptyStateProps = {
  title: string;
  children?: ReactNode;
};

export function AdminEmptyState({ title, children }: AdminEmptyStateProps) {
  return (
    <div className="admin-ui-state">
      <strong>{title}</strong>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

type AdminErrorStateProps = {
  onRetry: () => void;
};

export function AdminErrorState({ onRetry }: AdminErrorStateProps) {
  return (
    <div className="admin-ui-state admin-ui-state-error" role="alert">
      <p>We couldn&apos;t load this. Try Again.</p>
      <button className="admin-ui-retry" onClick={onRetry} type="button">Try again</button>
    </div>
  );
}

type AdminToastProps = {
  message: string;
  onDismiss: () => void;
};

export function AdminToast({ message, onDismiss }: AdminToastProps) {
  if (!message) return null;

  return (
    <div aria-live="polite" className="admin-ui-toast" role="status">
      <span>{message}</span>
      <button aria-label="Dismiss notification" onClick={onDismiss} type="button">Dismiss</button>
    </div>
  );
}

type AdminConfirmDialogProps = {
  open: boolean;
  title: string;
  children?: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AdminConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      aria-labelledby={titleId}
      className="admin-ui-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      ref={dialogRef}
    >
      <h2 id={titleId}>{title}</h2>
      {children ? <div className="admin-ui-dialog-content">{children}</div> : null}
      <div className="admin-ui-dialog-actions">
        <button className="admin-secondary-button" onClick={onCancel} type="button">Cancel</button>
        <button className="admin-primary-button" onClick={onConfirm} type="button">{confirmLabel}</button>
      </div>
    </dialog>
  );
}
