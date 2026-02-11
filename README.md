# Finance ARG

Aplicación financiera personal para usuarios en Argentina. Estilo visual inspirado en Instagram.

## Características

- 📱 **Diseño estilo App**: Feed limpio, navegación inferior, tarjetas.
- 💰 **Multimoneda**: Soporte nativo para ARS y USD con tasa de conversión configurable.
- 📊 **Estadísticas**: Gráficos de gastos por categoría.
- 🧾 **Impuestos**: Configuración de impuestos flexible.
- 💾 **Persistencia**: LocalStorage (por defecto) y listo para Firebase.

## Instalación

1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Configuración de Firebase (Opcional)

Para habilitar la nube:
1. Crear un proyecto en Firebase Console.
2. Copiar la configuración web.
3. Crear un archivo `.env` en la raíz con las siguientes variables:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
...
```
4. Descomentar la lógica de sincronización en `src/store/useMovementStore.js` (requiere implementación adicional de sync).

## Tecnologías

- React + Vite
- Zustand (State Management)
- Recharts (Gráficos)
- Lucide React (Iconos)
