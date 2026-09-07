import React from 'react';

export const PaperPlane: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => {
  return (
    <div className={`obj-stage obj-plane ${className}`} style={style} aria-hidden="true">
      <div className="obj-plane-inner">
        <span className="obj-plane-facet facet-left" />
        <span className="obj-plane-facet facet-right" />
        <span className="obj-plane-facet facet-keel" />
        <span className="obj-plane-facet facet-shadow" />
      </div>
    </div>
  );
};

export const StorageCube: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => {
  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  return (
    <div className={`obj-stage obj-cube ${className}`} style={style} aria-hidden="true">
      <div className="obj-cube-inner">
        {faces.map(f => (
          <span key={f} className={`obj-cube-face cube-${f}`}>
            <i /><i /><i /><i />
          </span>
        ))}
      </div>
    </div>
  );
};

export const MailCard: React.FC<{ label?: string; tone?: string; lines?: number; className?: string; style?: React.CSSProperties }> = ({
  label,
  tone = 'brand',
  lines = 3,
  className = '',
  style,
}) => {
  return (
    <div className={`obj obj-file tone-${tone} ${className}`} style={style} aria-hidden="true">
      <div className="obj-face obj-file-front">
        <span className="obj-file-corner" />
        <span className="obj-file-lines">
          {Array.from({ length: lines }).map((_, i) => (
            <i key={i} style={{ width: `${88 - i * 18}%` }} />
          ))}
        </span>
        {label && <span className="obj-file-label">{label}</span>}
      </div>
      <div className="obj-face obj-file-side" />
      <div className="obj-face obj-file-bottom" />
    </div>
  );
};

export const Hero3DScene: React.FC = () => {
  return (
    <div className="hero-3d-stage-wrapper" aria-hidden="true">
      <div className="hero-3d-stage">
        <div className="hologram-ring" />
        <div className="hologram-grid" />

        <div className="hero-3d-plane-container">
          <PaperPlane className="hero-3d-plane" />
          <div className="plane-trail" />
        </div>

        <div className="hero-3d-cube-container">
          <StorageCube className="hero-3d-cube" />
        </div>

        <MailCard tone="brand" label="resend_api.json" className="hero-3d-card card-1" />
        <MailCard tone="soft" label="brevo_failover.ts" className="hero-3d-card card-2" />
        <MailCard tone="muted" label="smtp_relay.env" className="hero-3d-card card-3" />

        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
      </div>
    </div>
  );
};
