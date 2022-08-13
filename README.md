# Criollo Atomizadores 3.0

Criollo Atomizadores es una aplicación utilitaria para tablets y smartphones que permite calcular los principales parámetros hidráulicos de operación de atomizadores o pulverizadoras hidroneumáticas y realizar la verificación estática correspondiente.  
Al usar la aplicación es posible calcular alternativamente la velocidad de avance del equipo, la presión de trabajo y el volumen de pulverización. También es posible realizar la verificación de los picos y obtener el diagnóstico rápido del estado de los mismos. Cuenta con un calculador de mezclas para los productos del caldo de pulverización.   
La información generada a partir del ingreso de los datos y los cálculos realizados se compila en un reporte que puede ser guardado en formato PDF y compartido mediante correo electrónico y/o WhatsApp.  
Una vez instalada, la utilización de Campero no requiere disponibilidad de señal ni acceso a la red. Estos servicios sólo son necesarios si se desea compartir los reportes generados o para descargar el manual de utilización de la misma.  

### [Disponible en Google Play!](https://play.google.com/store/apps/details?id=com.inta.criolloatm)  

![criollo-atm](doc/promocion_criollo_atm.jpg)

### Versión 3.0 [3] (Migración nativo -> híbrido)
  - Implementación con Vite (Rollup): ReactJS (v18) + Framework7 + Capacitor.
  - Nueva presentación. Mejoras en control y validación de campos.  
  - Se pierde el control de volumen en la vista de verificación de picos. En lugar de forzar el volumen al máximo, se avisa al usuario de que suba el volumen para que las alertas sean audibles. El control de "keep awake" se realiza con un plugin CapacitorJS.  
  - Los reportes se generan secuencialmente.  
  - Los formularios tienen almacenamiento persistente de datos, no se pierden al cambiar de vistas o si la app queda en segundo plano, pero se borran al salir (previo confirmacion del usuario).  
  - El almacenamiento de los datos se realiza en Storage de Capacitor en el caso nativo, en avt.storage en el caso de la extensión Auravant o en localStorage en el caso web.  


## Instalación y despliegue

Descargar código fuente e instalar dependencias
```bash
$ git clone https://github.com/sendevo/criollo-atomizadores  
$ cd criollo-atomizadores  
$ npm install  
```

Correr versión web para debug (localhost:3000)
```bash
$ npm run dev
```

Compilar versión web optimizada
```bash
$ npm run build
```

### Compilar apk (android) por primera vez:
1.- Instalar android studio y ubicar carpeta de instalación.  

2.- Agregar plataforma con capacitor y generar proyecto android-studio:  

```bash
$ export CAPACITOR_ANDROID_STUDIO_PATH="..../android-studio/bin/studio.sh"
$ export PATH=~/.npm-global/bin:$PATH  
$ npx cap add android
$ npm run build && npx cap sync
```

3.- Agregar permisos en android/app/src/main/AndroidManifest.xml:  

```xml
...
<aplication>
  ...
  android:requestLegacyExternalStorage="true"
  ...
</application>
...
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

4.- Definir iconos y splashcreens en android/app/src/main/res.  

5.- Abrir proyecto de AndroidStudio:
```bash
$ npx cap open android
```

### Recompilar apk (android) luego de cambios en la versión web:
```bash
$ npm run build && npx cap sync
$ npx cap open android
```

### Compilar versión release con AndroidStudio:  
1.- Editar versionName y versionCode en android/app/build.gradle   
2.- Ir al menú Build -> Generate Signed Bundle/APK...  
3.- Ingresar directorio de la firma (.jks), claves "Key Store Password" y "Key Password".  
4.- Generar app-release.apk o app-release.aab.   
5.- Preparar capturas de pantalla y lista de cambios.   



### Backlog
#### Progreso: 90%


Funcionales
  - [x] Sección parámetros de pulverización.  
    - [x] Vista principal.  
    - [x] Configuración de arcos.  
    - [x] Gestión de arcos.  
    - [x] Cálculo de resultados.  
    - [x] Medidor de velocidad. 
    - [x] Medidor de TRV.  
    - [x] Control de campos.  
    - [x] Cargar resultados a reporte.  
  - [x] Sección verificación de picos.  
    - [x] Vista principal.  
    - [x] Cálculo de resultados.  
    - [x] Cambio de arco.  
    - [x] Cargar resultados a reporte.  
  - [x] Sección calculo de mezclas.  
    - [x] Vista con formulario.  
    - [x] Cálculo de insumos.  
    - [x] Navigator/Capacitor GPS.  
    - [x] Vista de resultados.  
    - [x] Control de campos.  
    - [x] Cargar resultados a reporte.  
  - [x] Sección reportes.  
    - [x] Vista de listado de reportes.  
    - [x] Gestión de reportes.  
    - [x] Vista de presentación de reportes.  
    - [x] Exportar reporte a PDF y compartir. 
  - [x] Sección seguridad e higiene.  
  - [x] Sección Información y ayuda.  
    - [x] Menú de enlaces.  
    - [x] Sección acerca de.  
    - [x] Enlace informacion adicional.  
    - [x] Recorrido por la app (modo ayuda).  

No funcionales  
  - [x] Creación repositorio.  
  - [x] Proyecto React con Vite.   
  - [x] Recursos multimedia.
  - [x] Código fuente.   
  - [ ] Compilación a Android.  
  - [ ] Publicación de versiones a producción.  
    - [x] Web.  
    - [ ] Google Play.  
    - [ ] Auravant.  