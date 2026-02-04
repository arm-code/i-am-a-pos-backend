# I AM A POS (Point of Sale Backend)

Backend para un sistema Punto de Venta (POS) local diseñado para una pequeña tienda minorista. Este sistema funciona 100% offline y gestiona inventario, clientes, ventas y reportes.

## Stack Tecnológico

- **Framework**: NestJS (TypeScript)
- **ORM**: TypeORM
- **Base de Datos**: PostgreSQL (Local vía Docker)

## Requisitos Previos

1. **Docker y Docker Compose**: Para levantar la base de datos localmente.
2. **Node.js**: Versión LTS recomendada.
3. **pnpm**: Instalado globalmente (`npm install -g pnpm`).

## Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone <repo-url>
   cd i-am-a-pos-backend
   ```

2. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**:
   El proyecto utiliza `@nestjs/config` para gestionar la configuración. Soporta diferentes archivos según el entorno:
   - `.env`: Configuración por defecto y desarrollo local.
   - `.env.production`: Configuración para entornos de producción (tiene prioridad sobre `.env`).

   **Variables requeridas**:
   | Variable | Descripción | Ejemplo (Dev) |
   | :--- | :--- | :--- |
   | `PORT` | Puerto donde correrá el servidor | `4000` |
   | `BD_HOST` | Host de la base de datos | `localhost` |
   | `BD_PORT` | Puerto de PostgreSQL | `5432` |
   | `BD_USER` | Usuario de la DB | `postgres` |
   | `BD_PASSWORD` | Contraseña de la DB | `123456` |
   | `BD_DATABASENAME`| Nombre de la base de datos | `postgres` |
   | `JWT_SECRET` | Clave secreta para tokens JWT | `any-secret` |
   | `NODE_ENV` | Entorno (`development` / `production`) | `development` |

4. **Conexión a la Base de Datos**:
   El sistema está configurado para conectarse a una instancia de PostgreSQL. 
   - **En Desarrollo**: Se recomienda usar Docker. El comando `pnpm run db:up` levanta un contenedor según el archivo `docker-compose.yml`. Las credenciales en el `.env` deben coincidir con las definidas en dicho archivo.
   - **TypeORM**: La conexión se gestiona de forma asíncrona en el `AppModule`, cargando las entidades automáticamente (`autoLoadEntities: true`). En desarrollo, `synchronize: true` está habilitado para reflejar cambios en las entidades sin migraciones manuales.

5. **Levantar la base de datos**:
   ```bash
   pnpm run db:up
   ```

## Ejecución del Proyecto

1. **Modo Desarrollo**:
   ```bash
   pnpm run dev
   ```
   *Esto levantará la base de datos (si no está arriba) y arrancará el servidor en modo watch.*

2. **Producción**:
   ```bash
   pnpm run build
   pnpm start:prod
   ```

## Documentación API (Swagger)

Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva en:
`http://localhost:3000/api`

## Despliegue en Producción

Para poner el sistema en marcha en un entorno de producción, sigue estos pasos:

### 1. Preparar Variables de Entorno
Crea un archivo `.env.production` en la raíz del proyecto. Este archivo será ignorado por Git pero cargado por NestJS con prioridad:

```env
PORT=4000
NODE_ENV=production
BD_HOST=tu-servidor-db.com
BD_PORT=5432
BD_USER=tu_usuario
BD_PASSWORD=tu_password
BD_DATABASENAME=tu_db
JWT_SECRET=una-clave-muy-segura
HOST_API=https://tu-dominio.com/api
```

### 2. Inicialización de la Base de Datos
En este proyecto, se utiliza la propiedad `synchronize: true` de TypeORM (configurada en `AppModule`). 

- **Primera ejecución**: Al arrancar el servidor por primera vez en producción con las credenciales correctas, TypeORM creará automáticamente todas las tablas necesarias.
- **Importante**: Asegúrate de que el usuario de la DB tenga permisos para crear tablas.

### 3. Compilación y Ejecución
Ejecuta los siguientes comandos para generar el bundle optimizado y arrancar el servidor:

```bash
# Instalar solo dependencias necesarias
pnpm install --prod=false # Se requiere pnpm install completo para hacer el build

# Generar el build (carpeta /dist)
pnpm run build

# Arrancar el servidor en modo producción
pnpm run start:prod
```

### 4. Mantener el proceso activo
Se recomienda usar un gestor de procesos como **PM2** para asegurar que el backend se reinicie automáticamente:

```bash
pnpm install -g pm2
pm2 start dist/main.js --name "pos-backend"
```

## Funcionalidades Principales

- **Inventario**: CRUD de productos y categorías con soporte para ventas por unidad y peso.
- **Clientes**: Gestión de saldos deudos y abonos.
- **Ventas**: Registro de ventas con tipos de pago (Efectivo, Tarjeta, Crédito) y descuento automático de stock.
- **Reportes**: Corte de caja diario y cálculo de ganancias netas.
- **Seed**: Endpoint controlado para poblar la base de datos con datos de ejemplo (Categorías, Productos y Clientes).

## Carga de Datos de Ejemplo (Seed)

Si deseas probar el sistema con datos de ejemplo, puedes ejecutar el siguiente endpoint (vía Swagger o Postman):

**POST** `http://localhost:3000/api/seed`

> [!WARNING]
> La ejecución de este endpoint **limpiará todas las tablas** antes de insertar los nuevos datos.
