# Velour Scent
Tienda pública y panel de administración (React 18 + React Router 6 + Create React App).

    npm install
    npm start

- Estilos globales: `src/index.css` (tema) y `src/App.css` (tienda).
- El navegador consulta `/api/products`, `/api/categories` y `/api/auth`.
- Las funciones Vercel usan `@neondatabase/serverless`; React nunca recibe ni usa la URL de Neon.
- Ejecutá `api/schema.sql` una vez en el SQL Editor de Neon para crear las tablas y cargar los seis productos y tres categorías iniciales.
- En Vercel configurá `DATABASE_URL`, `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET` como variables server-side en Project Settings → Environment Variables. No las declares con prefijo `REACT_APP_`.
- `REACT_APP_WHATSAPP` es una variable pública del frontend; completala con el número internacional sin `+` ni espacios.
- Para probar las funciones localmente, usá Vercel CLI (`vercel dev`) y configurá sus variables de entorno. `npm start` sirve para compilar y desarrollar el frontend CRA, pero no ejecuta las funciones de Vercel.
- Imágenes: agregá URLs desde el panel admin; el monograma sigue como placeholder mientras no haya archivos en `public/img/`.
