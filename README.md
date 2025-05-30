# InventoryApp
## Requisitos
Antes de ejecutar la aplicación asegúrate de tener instalado lo siguiente:

- [.NET 7 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [Docker](https://www.docker.com/) y Docker Compose
- Angular CLI:  npm install -g @angular/cli
# Ejecución de la aplicación
 -- clona el proyecto en una carpeta de tu PC
 -- git clone https://github.com/AndreaSG97/InventoryApp.git

# Ejecución del backend
- Levantar los servicios con Docker Compose
- 1 Ingresa a una temrinal en la dirección que se encuntra la carpeta Inventory-management
- 2 Ejecuta el siguiente comando docker-compose up --build
- 3 Ingresa SQL Server Management Studio (SSMS). y coloca:
-- --- Server: localhost,1433    user: sa pass: TuPassword123!
- 4 Abre el archivo Create&InsertTablesInventory.sql que esta en la raiz del proyecto y ejecuta el script

# Ejecución del frontend

- 1 Ingresa a otra temrinal en la dirección que se encuntra la carpeta Inventory-web
- 2 Ejecuta el comando ng serve
- 3 Ingresa a un browser y entra http://localhost:4200/ 
- 4 Se mostrar el sitio con la lista de productos

# Evidencias
- Listado dinámico de productos con paginación
![alt text](image.png)

- Listado dinámico de transacciones con paginación
![alt text](image-1.png)

- Pantalla para la creación de productos.
![alt text](image-2.png)
- mensaje de creación 
![alt text](image-3.png)

- Pantalla para la edición de productos.
![alt text](image-4.png)
- mensaje de edición
![alt text](image-5.png)
- verificar cambios
![alt text](image-6.png)
- Pantalla para la creación de transacciones.
- Type BUY
![alt text](image-7.png)
- mensaje 
![alt text](image-8.png)
- verificar que el stock aumenta con el Buy
![alt text](image-9.png)
- type SALE
![alt text](image-10.png)
- verificar que el stock disminuye con sale
![alt text](image-11.png)
- verificar que no se guarde porque no hay suficiente stock
![alt text](image-12.png)
- Pantalla para la edición de transacciones.
![alt text](image-13.png)
- mesaje
![alt text](image-14.png)
- Pantalla de filtros dinámicos productos.
- Por categoria
![alt text](image-15.png)
- Por nombre y categoria
![alt text](image-16.png)
- Pantalla de filtros dinámicos transacciones.
- Por tipo de transaccion
![alt text](image-17.png)
- Por tipo de transaccion y nombre de producto
![alt text](image-18.png)


