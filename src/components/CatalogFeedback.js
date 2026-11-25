export default function CatalogFeedback({ loading, error }) {
  if (!loading && !error) return null;
  return (
    <p
      role={error ? 'alert' : 'status'}
      className="container"
      style={{ paddingBlock: 16, color: 'var(--vs-mute)', fontSize: '.9rem', textAlign: 'center' }}
    >
      {error ? 'El catálogo no está disponible en este momento.' : 'Cargando catálogo...'}
    </p>
  );
}
