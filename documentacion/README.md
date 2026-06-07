# Documentación de Servicios Conectados — MediAción

Este documento detalla la infraestructura, los servicios externos conectados y el flujo de automatización del proyecto **MediAción** para que puedas revisarlo en cualquier momento.

---

## 🏗️ 1. Infraestructura de Código y Control de Versiones

### GitHub
* **Repositorio:** [https://github.com/Chemukeng/Mediacion.git](https://github.com/Chemukeng/Mediacion.git)
* **Rama Principal:** `main`
* **Función:** Almacena de manera segura todo el historial de cambios y código fuente de la web.
* **Estructura de Despliegue:** En el repositorio de GitHub se guardan los archivos estáticos de la web comercial directamente en la raíz (`index.html`, `style.css`, `script.js`, páginas legales, etc.). Los archivos de desarrollo de la aplicación principal de Next.js están configurados en el `.gitignore` local para no sobrecargar el repositorio de producción.

---

## 🚀 2. Servidor y Despliegue en Producción

### Vercel
* **Función:** Aloja la página web en producción (Live Web).
* **Integración (CI/CD):** Vercel está conectado directamente a tu cuenta de GitHub y vigila la rama `main`.
* **Flujo de Trabajo:** Cada vez que se realiza una subida (`git push`) al repositorio de GitHub, Vercel detecta la actualización al instante, compila e implementa los archivos, y los publica en producción en cuestión de segundos **de forma automática**. No requieres entrar en la web de Vercel para publicar cambios.

---

## ✉️ 3. Captura y Gestión de Leads / Formularios

### Formspree
* **Endpoint de Envío:** `https://formspree.io/f/mbdeoroo`
* **Form ID de Proyecto:** `mbdeoroo`
* **Función:** Actúa como el motor del backend para recibir los datos de los formularios. Recopila la información enviada por los usuarios en la web estática, filtra el correo no deseado (Spam) y te los envía a tu bandeja de correo personal.
* **Formularios Conectados:**
  1. **Lista de Espera** (Modal emergente al pulsar los botones *"Acceder a la App"* o *"Comenzar"* en la landing page).
  2. **Formulario de Contacto** (Página `/contacto.html`).
* **Ubicación en el código:** Configurado en la variable global `FORMSPREE_ID = "mbdeoroo"` en [script.js](file:///Users/chema/Desktop/Proyecto%20MedIAdor/script.js#L301) y en [contacto.html](file:///Users/chema/Desktop/Proyecto%20MedIAdor/contacto.html#L402).

---

## 💻 4. Entorno de Desarrollo y Pruebas en Local

### Servidor Local HTTP (http-server)
* **URL de Pruebas:** [http://localhost:3006](http://localhost:3006)
* **Directorio de Origen:** `/landing`
* **Comando de Arranque:** `npx -y http-server landing -p 3006`
* **Función:** Te permite visualizar y probar todos los cambios (carrusel de chasis, simulador de precios, animaciones, etc.) localmente en tu ordenador en el puerto `3006` antes de subirlos a producción.

---

## 🔄 5. Script de Actualización Automática

### `actualizar.sh`
* **Función:** Simplifica el proceso de subir cambios a producción sin tener que escribir comandos de consola complejos.
* **Ubicación:** [actualizar.sh](file:///Users/chema/Desktop/Proyecto%20MedIAdor/actualizar.sh) (en la raíz del proyecto).
* **Cómo usarlo:**
  1. Abres la terminal de tu ordenador en la carpeta del proyecto.
  2. Ejecutas el comando: `./actualizar.sh`
* **Qué hace internamente:**
  ```bash
  git add .                                         # Agrega todos los archivos modificados y nuevos
  git commit -m "Actualizacion automatica: [Fecha]" # Crea un punto de restauración con fecha actual
  git push origin main                              # Sube los cambios a GitHub (disparando el despliegue automático de Vercel)
  ```

---

*Para cualquier duda o modificación futura de los servicios, recuerda que el flujo básico es: **Editar archivos locales ➡️ Probar en localhost:3006 ➡️ Ejecutar `./actualizar.sh` para publicar en Vercel**.*
