# Proyecto backend para la gestión de puntos de venta

## Descripción
Este proyecto es la `API` que tiene como propósito la gestión de diversos puntos de venta con diversos enfoques. La idea es que pueda funcionar con diferentes enfoques; desde un punto de venta común y otros como renta o prestación de servicios.

---
## Configuración del proyecto para su ejecución

### Prerrequisitos
- Node.js (versión 18 o superior)
- Docker Desktop (para base de datos local)
- pnpm (gestor de paquetes)

### Pasos iniciales
1. Clonar el repositorio en tu máquina
2. Instalar dependencias: `pnpm install`
3. Instalar cross-env: `pnpm add -D cross-env`

### Configuración de variables de entorno
1. Crear un archivo `.env` en la raíz del proyecto basado en `.env.template`
2. Para desarrollo local, usar estas credenciales:
```env
# .env (Desarrollo Local)
BD_HOST=localhost
BD_PORT=5432
BD_USER=postgres
BD_PASSWORD=123456
BD_DATABASENAME=postgres
NODE_ENV=development
```

---
## Desarrollo Local

### Levantar base de datos con Docker
```bash
# Iniciar PostgreSQL local
npm run db:up

# Verificar que esté corriendo
docker ps

# Detener la base de datos
npm run db:down
```

### Ejecutar la aplicación en desarrollo
```bash
# Con synchronize: true (crea tablas automáticamente)
npm run dev
```

### Flujo de trabajo en desarrollo
1. **Nuevos desarrolladores**: Usar `synchronize: true` para crear tablas automáticamente
2. **Nuevas entidades**: Crear las entities en la carpeta correspondiente
3. **La base de datos se sincroniza** automáticamente con el código

---
## Migraciones (Para Producción)

### ¿Qué son las migraciones?
Son archivos que registran todos los cambios en la base de datos. Se usan en producción para aplicar cambios de forma controlada.

### Comandos de migraciones
```bash
npx typeorm-ts-node-commonjs -d ./ormconfig.ts migration:generate ./src/migrations/NombreDescriptivo

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración  
npm run migration:revert

# Ver migraciones aplicadas
npm run migration:show
```

### Flujo para enviar cambios a producción
1. **Desarrollo**: Trabajar con `synchronize: true`
2. **Pre-producción**: Generar migración con los cambios
3. **Producción**: Ejecutar `migration:run` (con `synchronize: false`)

### Ejemplo práctico
```bash
# Después de crear nuevas entities...
npx typeorm-ts-node-commonjs -d ./ormconfig.ts migration:generate ./src/migrations/AddFinanceTables

# Verificar el archivo generado en src/migrations/
# Ejecutar en local para probar
npm run migration:run

# Cuando esté probado, el archivo de migración se sube al repo
# En producción se ejecutará automáticamente
```

---
## Estructura del proyecto
```
src/
├── modules/          # Módulos de negocio existentes
│   ├── products/     # Gestión de productos
│   ├── categories/   # Categorías de productos
│   └── ...
├── finance/          # Nuevo módulo financiero
│   ├── entities/     # Entidades (tablas)
│   ├── services/     # Lógica de negocio
│   └── controllers/  # Endpoints API
└── migrations/       # Archivos de migración
```

---
## Reglas importantes
- ✅ **Desarrollo**: `synchronize: true` está permitido
- ❌ **Producción**: `synchronize: false` es obligatorio
- ✅ **Nuevas features**: Crear migraciones cuando estén probadas
- ✅ **Base de datos local**: Siempre usar Docker para consistencia

---
## Solución de problemas comunes

### Error de conexión a la base de datos
```bash
# Verificar que Docker esté corriendo
docker ps

# Si no está, iniciar contenedor
npm run db:up
```

### Error "NODE_ENV no reconocido"
```bash
# Asegurarse de tener cross-env instalado
pnpm add -D cross-env
```

### Las tablas no se crean
- Verificar que `synchronize: true` esté en `app.module.ts`
- Revisar que las entities estén correctamente importadas en los módulos

---
## Comandos útiles para el equipo
```bash
# Ver logs de la base de datos
docker-compose logs -f postgres

# Conectarse a la base de datos local
psql -h localhost -U postgres -d postgres

# Restablecer base de datos local (CUIDADO: borra todo)
docker-compose down && docker volume rm [nombre_volumen] && docker-compose up -d
```

