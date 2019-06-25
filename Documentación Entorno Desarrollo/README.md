# Entorno de desarrollo de Polux

Este repositorio configura un entorno de desarrollo haciendo uso de diferentes herramientas (Docker, docker-compose, postgresql, Schemapy) para crear contenedores con las API y el cliente del desarrollo de Polux logrando realizar las pruebas correspondientes.

Adentro de los archivos correspondientes al entorno de desarrollo existen tres que desencadenan la construcción del entorno **init, start, stop** con extensión .sh

## Requisitos:
 * [Docker](https://www.docker.com/)
 * [docker-compose](https://docs.docker.com/compose/)
 * No haber instalado postgresql de forma local, de haberlo hecho desinstalar y borrar las carpetas locales de bases de datos (se recomienda realizar backup de sus bases de datos) y reiniciar el equipo.
 * Agregar al usuario del host al grupo docker con el siguiene comando:

     ```
        sudo gpasswd -a $USER docker
    ```
 * Tener acceso a los repositorios del proyeto POLUX  
    * [polux_cliente](https://github.com/udistrital/polux_cliente) 
    * [polux_mid](https://github.com/udistrital/polux_mid)
    * [polux_crud](https://github.com/udistrital/polux_crud)



## Ejecución del Entorno:

* Clonar el repositorio con el entorno de desarrollo y ingresar en el (solo se tiene acceso mendiante permiso del creador del repositorio): 

    ```
       git clone https://github.com/JuanPiedrahita/Entorno_desarrollo_Polux.git
       cd Entorno_desarrollo_Polux
    ```
* Cambiar a la rama *beegoVersion* : 

    ```
        git checkout beegoVersion
    ```

* Se deben otorgar permisos de ejecución a los archivos desencadenadores con el siguiente comando:

    ```
       chmod 777 init.sh run.sh stop.sh
    ```
* Modificar el archivo *code.conf* que contiene las variables de entorno del proyecto polux: 
     
    * CLIENT_NAME = *Nombre del repositorio del cliente*
    * CLIENT_BRANCH = *Rama del repositorio del cliente a utilizar*
    * CLIENT_PORT = *Puerto del cliente*
    * CRUD_NAME = *Nombre del respositorio del CRUD de polux*
    * CRUD_BRANCH = *Rama del CRUD a utilizar* 
    * CRUD_PORT = *Puerto del CRUD*
    * CRUD_LOG_NAME = *Nombre del archivo del log del crud*
    * MID_NAME = *Nombre del repositorio del MID*
    * MID_BRANCH = *Rama del MID a utilizar*
    * MID_PORT = *Puerto del MID*
    * MID_LOG_NAME = *Nombre del archivo del log del MID*

* También el archivo *env_var.env* contiene variables de funcionamiento que pueden o no ser modificadas.

* Ejecutar el archivo init.sh

    ```
       ./init.sh
    ``` 
    La ejecución de este archivo por si solo realizará la clonación de los repositorios y construirá los contenedores necesarios para el proyecto, además de iniciar una base de datos y restaurar un backup presente en este repositorio.

Una vez ejecutado el script se deben comprobar los log de todos los contenedores creados y verificar que todos devuelvan un estado correcto, también se puede verificar el funcionamiento de cada una de las API realizando una petición *GET* a *localhost* con el puerto correspondiente de la API, por defecto las API devulven un *200 status OK* , por lo que deberá comprobarse así su funcionamiento.

Al ingresar a *localhost:9000* se ingresa al cliente de polux en donde se deberá autenticar con un usuario previamente autorizado con todos los roles para la aplicación, el resto del funcionamiento está especificado en los documentos de implementación de polux. 

Dentro del entorno de desarrollo se inicia un contenedor con un servidor apache que mediante SchemaPy genera de forma gráfica el modelo de la base de datos con sus relaciones que se  podran ver ingresando a *localhost:80*. 

