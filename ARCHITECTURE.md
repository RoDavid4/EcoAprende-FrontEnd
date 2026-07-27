# Arquitectura del Frontend - EcoAprende

## Vision General

El frontend de EcoAprende es una aplicacion de pagina unica (SPA) desarrollada en Angular. Sigue una arquitectura orientada a componentes, enfocada en la mantenibilidad, escalabilidad y la separacion clara de responsabilidades a nivel de componentes y vistas.

## Estructura de Carpetas

El codigo base reside en `src/app/`, subdividido estrategicamente para promover la modularidad:

- `core/`: Contiene los elementos singulares que conforman el esqueleto estructural de la aplicacion. Aqui residen interceptores HTTP, guards de rutas, y servicios de uso global y estricto (ej. autenticacion central).
- `features/`: Agrupa el comportamiento principal subdividido por caracteristicas de dominio (ej. dashboard, learning, admin). Cada modulo 'feature' debe operar como un segmento semi-autonomo y cargarse de manera perezosa (Lazy Loading) siempre que sea posible.
- `shared/`: Alberga componentes presentacionales puros, directivas y utilidades visuales genericas reutilizables. Esta seccion del proyecto no debe tener dependencias circulares con servicios de dominio ni conocimiento del estado de la aplicacion.

## Estrategia de Enrutamiento

Se aplica una configuracion basada en la definicion de rutas orientadas a modulos bajo demanda (Lazy Loading). Esto asegura que los artefactos de codigo transmitidos al navegador mantengan un peso estricto por ruta, incrementando el rendimiento de carga inicial.

## Manejo de Estado

El estado local e inter-componente se administra mediante flujos reactivos utilizando la libreria RxJS subyacente en Angular, asegurando sincronia y manejo asincrono ordenado de la interface de usuario.

## Estilos y UI

Se hace uso de SCSS como lenguaje nativo para las hojas de estilo del cliente, aprovechando el encapsulamiento (`ViewEncapsulation.Emulated`) por defecto de los componentes Angular para evitar colisiones globales.

## Contenerizacion

Para aislamiento local y estandarizacion de despliegues, la app incluye un `Dockerfile` y `docker-compose.yml` orientados a mantener la modularidad e integracion continua. El servidor dev incorporado maneja el enlace de archivos en caliente.
