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
   Crea un archivo `.env` basado en `.env.template` (o usa el que ya está configurado para desarrollo local). Asegúrate de que las credenciales coincidan con las de `docker-compose.yml`.

4. **Levantar la base de datos**:
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

## Funcionalidades Principales

- **Inventario**: CRUD de productos y categorías con soporte para ventas por unidad y peso.
- **Clientes**: Gestión de saldos deudos y abonos.
- **Ventas**: Registro de ventas con tipos de pago (Efectivo, Tarjeta, Crédito) y descuento automático de stock.
- **Reportes**: Corte de caja diario y cálculo de ganancias netas.
