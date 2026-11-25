import { useEffect, useState } from 'react';

const KEY = 'vs_profile';

export default function AdminProfile() {
  const [profile, setProfile] = useState({ name: 'Velour Scent', email: 'hola@velourscent.com' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY));
      if (stored) setProfile((current) => ({ ...current, ...stored }));
    } catch {
      localStorage.removeItem(KEY);
    }
  }, []);

  const submit = (event) => {
    event.preventDefault();
    localStorage.setItem(KEY, JSON.stringify(profile));
    setSaved(true);
  };

  return (
    <>
      <h1>Perfil</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 24, maxWidth: 500 }}>
        <label>Nombre de la tienda<input required value={profile.name} onChange={(event) => { setProfile({ ...profile, name: event.target.value }); setSaved(false); }} /></label>
        <label>Correo electrónico<input type="email" required value={profile.email} onChange={(event) => { setProfile({ ...profile, email: event.target.value }); setSaved(false); }} /></label>
        <button type="submit">Guardar</button>
        {saved && <p role="status">Cambios guardados.</p>}
      </form>
    </>
  );
}
