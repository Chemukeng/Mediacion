# Funcionamiento de la Aplicación y Guía del Proyecto

Este documento detalla el enrutamiento, la funcionalidad interactiva, la lógica de negocio y el sistema de simulación del proyecto **MediAción**.

---

## 🗺️ Mapa de las 11+ Pantallas Implementadas

La aplicación se ha desarrollado con un diseño responsivo adaptado al marco de un dispositivo móvil, integrado en el layout principal. Puedes interactuar con las siguientes vistas:

### 1. Iniciar Sesión (`/login` ➔ `screen copia 7.png`)
* **Diseño:** Chasis de móvil con fondo claro y minimalista, logotipo tipográfico premium *MediAción* con la 'A' en oro y la 'i' en oro, el lema *ACUERDOS INTELIGENTES* en verde oscuro, y un botón blanco premium de Google con borde dorado. Con espaciado vertical centrado y optimizado.
* **Flujo:** Drawer inferior animado para invitar/vincular a la expareja. Redirige automáticamente a la pantalla de invitación si no se ha vinculado antes.
* **Módulo Explicativo:** Incluye el botón *"¿Cómo funciona el sistema de mediación?"* que abre un modal con el flujo resumido en 4 pasos.

### 1.2. Pantalla de Invitación / Vinculación (`/invitacion` ➔ NUEVA)
* **Diseño:** Interfaz adaptada con los tres estados del flujo de invitación:
  - *Estado A (Sin enviar):* Formulario de envío (nombre, email, mensaje personalizado).
  - *Estado B (Pendiente):* Visualizador de invitación enviada, campo con enlace de invitación y botón de copiado rápido, botón para reenviar recordatorios y acceso directo temporal al Vestíbulo.
  - *Estado C (Establecido):* Muestra un check de éxito esmeralda gigante e invita al usuario a comenzar la mediación.

### 1.3. Pantalla Invitación Receptora (`/invitacion-receptora` ➔ NUEVA)
* **Diseño:** Pantalla pública que simula la recepción del enlace por parte del cónyuge invitado (David Martín).
* **Interactividad:**
  - *Mensaje Personalizado:* Muestra el mensaje redactado por el emisor.
  - *Argumentos de Convicción:* Tarjetas detallando el ahorro de costes contenciosos individuales, el control de la decisión por encima del criterio de un juez desconocido, y la confidencialidad de la Bóveda Privada (aclarando que Marta nunca leerá sus respuestas).
  - *Aceptar e Iniciar:* El botón principal simula el emparejamiento y la redirige al Vestíbulo (`/vestibulo`) como usuario vinculado.

### 2. Vestíbulo / Dashboard (`/vestibulo` ➔ `screen copia 4.png`)
* **Diseño:** Saludo "Buenas noches, Marta", tarjetas de acceso a Bóveda, Mesa de Negociación y El Libro Mayor.
* **Interactividad:**
  - *Banner superior dinámico:* Enlace a `/invitacion`. Si no se ha enviado invitación, se muestra amarillo ("VINCULACIÓN PENDIENTE"); si se ha enviado, muestra un estado en gris/verde intermedio ("VINCULACIÓN EN PROCESO"); si la ex-pareja completa su fase, se vuelve verde esmeralda brillante ("MEDIACIÓN ACTIVA").
  - La tarjeta de "Mesa" cambia dinámicamente de bloqueada a desbloqueada. La tarjeta de "El Libro Mayor" redirige a la pantalla de borrador y firmas.

### 3. Bóveda Unificada - Preparación (`/boveda` ➔ `Captura de pantalla 2026-06-03 a las 0.02.55.png`)
* **Diseño:** Panel de estado con barra de progreso dorada (calcula el avance real del caso). Estructura dividida en dos bloques bien diferenciados:
  - **Bloque 1: Preparación del Caso (Para la Mesa):** Contiene el Cuestionario Básico, Cuestionario Dinámico e IA y el Asistente de Propuestas.
  - **Bloque 2: Intimidad y Diario Emocional:** Contiene el Diario de Desahogo Privado.
* **Interactividad y Bloqueo:**
  - Las herramientas se habilitan según el progreso.
  - Al final de la sección de Preparación se incluye el botón *"Finalizar Fase de Preparación"*, que se habilita únicamente cuando ambos cuestionarios han sido cumplimentados y enviados.
  - Al pulsar el botón, el estado del usuario cambia a finalizado y muestra un estado de espera dinámico (*"Esperando a que David Martín finalice..."*).

### 4. Cuestionario Básico Form (`/boveda/cuestionario-basico` ➔ `screen copia.png`)
* **Diseño:** Formulario unificado de Perfil Familiar y Patrimonial: Hijos en común (Ninguno, Menores, Mayores), Tipo de vivienda (Alquiler, Hipoteca, Varias), Régimen matrimonial (Gananciales, Separación de Bienes, Desconocido), Deudas conjuntas y campo de objetivos de la mediación.
* **Interactividad Dinámica:** Progressive Disclosure. Las secciones secundarias inician colapsadas.
  - *Hijos menores:* Al seleccionar "Menores de edad", se despliega la pregunta sobre la cantidad de hijos (1, 2, 3 o más). Dependiendo de la cantidad seleccionada, se generan dinámicamente campos individuales para ingresar de forma separada la edad de cada hijo (*"Edad de Hijo 1"*, *"Edad de Hijo 2"*, etc.).
  - *Hipoteca:* Si selecciona vivienda con hipoteca o deudas hipotecarias, se despliega un único campo simple para ingresar la **cuota mensual de la hipoteca (€)** (eliminando datos innecesarios como el banco acreedor).
  - *Progreso Dinámico y Sellado:* En la cabecera del cuestionario se muestra una barra de progreso interactiva que calcula en tiempo real el porcentaje de cumplimentación de los campos (0% a 100%). Al presionar "Guardar y Continuar", el cuestionario se bloquea en modo lectura (los campos se deshabilitan y el botón cambia a "Cuestionario Sellado en Bóveda") impidiendo modificaciones posteriores.

### 5. Cuestionario Dinámico SEAT León (`/boveda/cuestionario-dinamico` ➔ `screen copia 2.png`)
* **Diseño:** Pregunta 3 de 8 sobre la adjudicación del coche familiar con aviso de confidencialidad.
* **Interactividad:** Tres tarjetas de selección (Me lo quedo, Para mi expareja, Vender y dividir) con marcas de verificación. Tarjeta informativa con la valoración oficial del coche (13.200€) y botón "Enviar confidencialmente" con candado.
  - *Progreso y Sellado:* La barra de progreso de la pregunta se visualiza al 37.5% en edición, subiendo al 100% (marcada como Completado) una vez enviada confidencialmente. En ese momento, se bloquean las opciones y el botón final muestra "Respuesta Sellada en Bóveda".

### 6. Bóveda Chat Privado / Diario (`/boveda/chat-privado` ➔ `screen.png`)
* **Diseño:** Cabecera verde con indicador de encriptación. Hilo de conversación confidencial de Marta con la IA mediadora analizando la tensión por la festividad de Nochebuena.
* **Acciones:** Tarjeta de acción sugerida interactiva para proponer "Custodia Navidad" y botón inferior **"Sellar"** con candado para encriptar la sesión.

### 7. Asistente de Propuestas Chat (`/asistente-propuestas` ➔ `screen copia 3.png`)
* **Diseño:** Chat de negociación sobre la pensión compensatoria. Incluye la tarjeta de la sugerencia legal (IA) citando el Art. 97 del Código Civil y jurisprudencia.
* **Acciones:** El botón **"Aceptar para el Cuestionario"** aprueba la propuesta reducida de 350€ y actualiza automáticamente el estado de la Mesa de Negociación a "Acordado".

### 8. Mesa de Negociación (`/mesa` ➔ `screen copia 5.png`)
* **Diseño:** Visualizador del progreso general. Tarjetas estructuradas idénticas a los diseños: Distribución Residencia (Pendiente), Custodia Fines de Semana (En discusión/Acordado), Gastos Educación Extra (Acordado).
* **Mesa Protegida (Lógica Cooperativa):**
  - Si el usuario o su cónyuge no han finalizado y sellado la fase de Bóveda, al entrar en `/mesa` se muestra una pantalla de espera premium con un escudo dorado y un estado en tiempo real de cada cónyuge (Marta: Listo, David Martín: Preparándose...).
  - Un candado dorado de seguridad aparece sobre el icono de `MEDIACIÓN` en el menú de navegación inferior cuando está bloqueado.
  - Una vez ambos cónyuges completan y firman la fase de preparación en su Bóveda, la Mesa se desbloquea al instante, permitiendo contrastar propuestas y proceder a la firma.

### 8.5. Certificado MASC de Incomparecencia (`/mesa/certificado-masc` ➔ NUEVA)
* **Diseño:** Pantalla de acreditación judicial estructurada con una cabecera formal y un panel estilo máquina de escribir/documento que simula el Acta Oficial de finalización sin acuerdo.
* **Interactividad y Lógica:**
  - *Requisitos de Validez:* Valida dinámicamente tres condiciones: 1) Identificación biométrica (KYC) del usuario actual, 2) Identificación biométrica (KYC) de la expareja, y 3) Cumplimiento de 30 días de inactividad negociadora.
  - *Preview Interactiva:* Muestra un sello holográfico de firma digital y un hash SHA-256 de auditoría blockchain.
  - *Descarga Física:* Si se cumplen las condiciones y tras realizar el **micropago de 80€** mediante pasarela expresa (tarjeta / Apple Pay), el usuario puede descargar el archivo de texto estructurado (`Acta_Intento_Mediacion_MASC.txt`) listo para entregar a su abogado e interponer demanda de divorcio contencioso.

### 9. Borrador y Firma del Convenio (`/mesa/libro-mayor` ➔ `screen copia 8.png`)
* **Diseño:** Documento de texto formal de divorcio de Alejandro y María López con estipulaciones desplegables.
* **Interactividad:**
  - *Bloqueo de firmas:* Si los acuerdos no se han cerrado al 100% en la Mesa de Negociación, se muestra un banner de advertencia ("Firma Bloqueada"), Alejandro aparece con "Firma no disponible", y el botón de María e "Aprobar y Firmar" inferior se inhabilitan con candados.
  - *Servicio de Mediador Humano Letrado:* Si el borrador de firma está bloqueado por desacuerdos (`mediatorProgress < 100`), se muestra una tarjeta premium que ofrece los servicios de un **Mediador Humano Letrado** (tarifa fija de 120€ por sesión online virtual de 2 horas, con 1 hora dedicada de forma independiente a cada cónyuge). El usuario puede pulsar "Contratar Mediador" para abrir un modal de reserva interactivo donde selecciona la estipulación en conflicto y solicita su asignación neutral. **Nota legal de imparcialidad integrada**: Tanto en la tarjeta como en el modal de reserva, se ha añadido una advertencia explícita informando de que el mediador actúa de forma estrictamente neutral, sin posicionarse jamás de lado de ninguno de los cónyuges con independencia de quién realice el pago o solicite la sesión.
  - *Bloqueo por KYC Pendiente:* Si los acuerdos están al 100% pero la identidad de la usuaria no ha sido certificada en la sección KYC (`/perfil/verificacion`), se despliega una alerta dorada indicando "Certificación KYC Pendiente". El botón de firma de María cambia a "VERIFICAR PARA FIRMAR" (apuntando al flujo KYC) y el botón inferior se actualiza a "Verificar Identidad para Firmar".
  - *Mesa y KYC Completos:* Una vez resueltos todos los puntos y certificada la identidad de María, Alejandro estampa su firma digital, habilitando el botón interactivo **"Pulsar para firmar"** de María y permitiendo la aprobación e inicio de la ratificación legal.

### 10. Acuerdo Alcanzado - Éxito (`/mesa/acuerdo-alcanzado` ➔ `Captura de pantalla 2026-06-03 a las 0.04.10.png`)
* **Diseño:** Pantalla de celebración tras la firma con el emblema circular dorado de "MediAción Convenio Regulador" y el mensaje de felicitación.
* **Interactividad:** Optimización de embudo. Tanto el botón principal "Iniciar Ratificación" como el botón secundario "Descargar acuerdos alcanzados" redirigen ahora a la pantalla de Ventajas del Trámite Legal (`/mesa/ventajas`) para motivar el paso por caja.

### 10.5. Ventajas del Trámite Legal (`/mesa/ventajas` ➔ NUEVA)
* **Diseño:** Pantalla comparativa premium que contrasta las ventajas de tramitar el divorcio con el servicio legal integrado de MediAción (tarifa plana de 500€ u 800€ compartible [250€ o 400€ c/u] según la existencia de hijos o propiedades, abogado y procurador asignados en 24h, firma digital) frente a los riesgos y costes de hacerlo de manera autónoma (~1.200€, procurador no incluido, riesgo de rechazo por cláusulas erróneas).
* **Interactividad:**
  - El botón principal "Asegurar Trámite Completo" avanza hacia el Pago de Honorarios (`/mesa/pago`).
  - La opción secundaria de descargar el borrador por libre activa un modal de advertencia legal que recalca que el borrador carece de validez sin abogado y procurador colegiados, y redirige a la pantalla de opciones de descarga (`/mesa/descargas`).

### 10.8. Opciones de Descarga y Freemium (`/mesa/descargas` ➔ NUEVA)
* **Diseño:** Pantalla de opciones de descarga con dos bloques de paquetes diferenciados: descarga gratuita del resumen o compra del Convenio Regulador técnico formalizado por 80€.
* **Interactividad:**
  - *Paquete Gratuito (Resumen Colaborativo):* Permite descargar en 1-Clic el documento de acuerdos redactado en lenguaje plano común, avisando de que carece de validez legal.
  - *Paquete Convenio Técnico (80€):* Abre un modal deslizante de checkout rápido (Tarjeta / Apple Pay) de 80€. Al realizar el pago ficticio, activa la descarga del borrador con redacción jurídica profesional.
  - *Banner de Descuento:* Ofrece el reintegro de los 80€ si el usuario decide posteriormente contratar el servicio de Abogados y Procuradores para formalizar el divorcio judicial.

### 11. Pago de Honorarios (`/mesa/pago` ➔ `screen copia 6.png`)
* **Diseño:** Detalles de la contratación del abogado. Permite seleccionar mediante radios interactivos "Pago al 50%" (250€ o 400€ según perfil) o "Pago al 100%" (500€ u 800€) con pasarelas de pago cifradas.
* **Interactividad:**
  - Se ha integrado un botón de llamada a la acción con borde discontinuo dorado dentro de la tarjeta de servicio principal: *"Ver todas las ventajas y garantías del servicio"*, que permite al usuario regresar a `/mesa/ventajas` para convencerse de la contratación.
  - El botón "Realizar Pago Seguro" liquida la simulación y redirige a la pantalla final de Confirmación y Abogado.

### 12. Confirmación y Abogado (`/mesa/finalizado` ➔ NUEVA)
* **Diseño:** Pantalla final que confirma el inicio del trámite legal formal con indicación de estado esmeralda, timeline interactivo y checklist de documentos requeridos.

### 13. Verificación de Identidad KYC (`/perfil/verificacion` ➔ NUEVA)
* **Diseño:** Pantalla de cumplimiento normativo (KYC/AML) para certificar la identidad de los cónyuges. Presenta módulos interactivos para la subida del documento de identidad y escaneo facial liveness.
* **Interactividad:**
  - *Tarjeta en Perfil:* El perfil muestra una tarjeta de estado dinámica: *"PENDIENTE"* en amarillo si no está verificado, y *"VERIFICADO"* en verde esmeralda con icono de escudo una vez completado. Al pulsarla redirige a la pantalla de verificación.
  - *Subida de DNI:* Simula el progreso de carga por separado para anverso y reverso con barras de carga y marcas de éxito.
  - *Escaneo Facial:* Simula un escáner facial biométrico con efectos visuales dinámicos de movimiento (barrido de haz luminoso) y cambio de estados instruccionales.
  - *Atajo Demo:* Incluye un botón para auto-verificar en un solo clic para fines de simulación inmediata.
  - *Integración con Firma:* El estado de verificación de identidad influye directamente sobre la disponibilidad de firmas oficiales en la pantalla del Libro Mayor.

---

## 🧪 Panel de Simulación y Evaluación

A la derecha de la aplicación móvil (en pantallas grandes), dispones de un **Panel de Simulación** que permite forzar el flujo del caso al instante:

1. **Navegación Rápida:** Haz clic en cualquiera de las 17 rutas enumeradas para saltar directamente a esa vista, incluso si hay dependencias bloqueadas.
2. **Interruptor "Ex completa fase":** Simula que el cónyuge invitado ha completado su fase. Habilita el Cuestionario Dinámico y desbloquea la Mesa de Negociación si el usuario ya ha finalizado su Bóveda.
3. **Indicadores de Estado:** Muestra en tiempo real si el usuario tiene verificado el KYC, si los cuestionarios están finalizados, si el convenio está firmado y si los pagos están realizados.
4. **Acciones Rápidas:** Botones para auto-verificar el KYC del usuario actual, marcar cuestionarios como listos al instante, y reiniciar el simulador a su estado original.

---

## 📂 Estructura del Código Fuente

El código se encuentra organizado de la siguiente manera dentro de la carpeta `src/`:

* **`src/app/`**: Enrutador de Next.js (App Router). Cada ruta contiene su archivo `page.tsx` para definir la vista y comportamiento.
  - `/login`: Pantalla de inicio y Drawer explicativo.
  - `/invitacion` e `/invitacion-receptora`: Envíos y aceptación de emparejamiento.
  - `/vestibulo`: Panel de control / Dashboard de la mediación.
  - `/boveda`: Sección unificada dividida en dos bloques con lógica de finalización de preparación.
  - `/boveda/cuestionario-basico`: Formulario interactivo con progressive disclosure.
  - `/boveda/cuestionario-dinamico`: Pregunta interactiva del SEAT León.
  - `/boveda/chat-privado`: Conversación emocional de desahogo.
  - `/asistente-propuestas`: Propuestas legales automáticas de la IA.
  - `/mesa`: Mesa de negociación (con bloqueo dinámico y tracking de estados de ambos cónyuges).
  - `/mesa/certificado-masc`: Certificación oficial de incomparecencia / desacuerdo.
  - `/mesa/libro-mayor`: Convenio a firmar, KYC Check y Mediador Humano.
  - `/mesa/acuerdo-alcanzado`: Pantalla de celebración y embudo.
  - `/mesa/ventajas`: Comparativa de trámite legal vs divorcio autónomo.
  - `/mesa/descargas`: Descarga de borrador resumen (Gratis) o técnico (50€) y Checkout rápido.
  - `/mesa/pago`: Selección de pagos del 50% o 100% y pasarela de checkout.
  - `/mesa/finalizado`: Confirmación, timeline legal y timeline de documentos.
  - `/perfil` y `/perfil/verificacion`: Datos del perfil y subida interactiva KYC.
* **`src/components/`**: Componentes visuales reutilizables.
  - `SimulationControls.tsx`: El panel de simulación lateral.
  - `HowItWorksModal.tsx`: El modal explicativo "¿Cómo funciona?".
* **`src/context/`**:
  - `SimulationContext.tsx`: Almacena el estado global de la simulación (enlaces, cuestionarios, firmas, KYC, pagos, etc.) y provee métodos para mutarlos y reiniciarlos.
* **`src/app/globals.css`**: Contiene la definición de colores y el sistema de diseño visual (Verde `#13382C`, Oro `#B5944E`, etc.).
