export default function LuxuryTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .luxury-container, .luxury-hero__content { width: calc(100% - 48px) !important; max-width: none !important; }
        .luxury-hero__booking { right: 24px !important; width: min(460px, calc(100% - 48px)) !important; }
        @media (max-width: 720px) {
          .luxury-container, .luxury-hero__content { width: calc(100% - 32px) !important; }
          .luxury-hero__booking { left: 16px !important; right: auto !important; width: calc(100% - 32px) !important; }
        }
      `}</style>
      {children}
    </>
  );
}
