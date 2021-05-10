#  Botón de Pago Yappy - Módulo de Node.js

##  Descripción
Botón de Pago Yappy es el *checkout* oficial de Banco General para integraciones con Node. Ofrezca Yappy como método de pago a más de 600 mil clientes y reciba pagos con Yappy directamente en su tienda o aplicación.
Rápido, seguro y fácil de implementar en su sitio web.

## Documentación

Encuéntrala en [www.bgeneral.com](Https://www.bgeneral.com/desarrolladores)

## Requerimientos mínimos

Node 10.24.0+

Una cuenta jurídica con Yappy

Un [certificado SSL](https://docs.woocommerce.com/document/ssl-and-https/)

## Resumen de implementación

Esta es una *guía de implementación básica* del módulo de Node. Usted puede instalarlo como mejor se adapte a la configuración de su aplicación, siguiendo los pasos a continuación:
1. Descarga del archivo
2. Instalación de los módulos de Node.js
3. Implementación del módulo de back-end
4. Implementación del Botón de Pago Yappy (front-end)
5. Configuración de notificación instantánea de pago (opcional)
6. Conexión de prueba

# Guía de ejemplo
> Antes de comenzar la instalación, asegúrese de contar con las credenciales de conexión proporcionadas en la Banca en Línea Comercial del comercio (el ID del comercio es un valor alfanúmerico de 32 caracteres). Si no cuenta con las credenciales, siga los paso de la [Guía de activación del Botón de Pago Yappy](https://www.bgeneral.com/desarrolladores/boton-de-pago-yappy/activacion-del-boton-de-pago-yappy/).

### 1. Descarga de los archivos
** - Módulo back-end**

Contiene la lógica de negocio de Yappy. Este módulo permite obtener la URL con la información de pago para ir al sitio seguro de Banco General. Además, este módulo verifica el estado de la orden para actualizarlo en su aplicación.

** - Módulo front-end**

Se utiliza para mostrar el Botón de Yappy en su sitio web.

### 2. Instalación de los módulos de Node.js

Copie los archivos comprimidos a la raíz de su proyecto. Recomendamos que los archivos se encuentren al mismo nivel del package.json.
- **Paquete de Node.js de back-end:**

Para instalar el módulo en su proyecto, ejecute el siguiente comando:
`npm install yappy-node-sdk-X.X.X.tgz`

- **Paquete de Node.js de front-end:**

Para instalar el módulo en su proyecto, ejecute el siguiente comando:
```npm install yappy-js-sdk-X.X.X.tgz```

### 3.Implementación del módulo de back-end:
A continuación se describirá el paso a paso del proceso de implementación. Como parte de esta guía, contamos con un proyecto de ejemplo **ejemplo.zip** de referencia.

**3.1)** Primero, importe el módulo de Node de Yappy.

**JavaScript**
```javascript
import ** as yappy from "yappy-node-sdk";
```

**3.2)** Inicialice el cliente.
```
const yappyClient = yappy.createClient(
  process.env.MERCHANT_ID,
  process.env.SECRET_KEY
 );
```

>Nota: Por seguridad, cree un archivo .env donde se encuentren las credenciales de **MERCHANT_ID** y **SECRET_KEY**.

**3.3)** Obtenga el URL del sitio de pagos de Banco General.

```
const payment= {
 total: 20.17,
 subtotal: 20.00,
 shipping: 0.00,
 discount: 0.00,
 taxes: 0.17,
 orderId: '1234',
 successUrl: 'https://www.urlsuccess.com',
 failUrl: 'https://www.urlfail.com',
 tel: '61122345',
 domain: 'https://www.tutienda.com',
 }
 const response = await yappyClient.getPaymentUrl(payment); // Pago normal
 const response = await yappyClient.getPaymentUrl(payment,true); //Para donaciones
 const response = await yappyClient.getPaymentUrl(payment,true, true); //Para donaciones, en modo prueba
 const response = await yappyClient.getPaymentUrl(payment,false, true); //Pago normal, en modo prueba`
  ```

 A continuación se describen los campos para realizar la solicitud:

 | Nombre del campo       | Descripción                                                                                                                                                                                                                                                                                                |
 |------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | **Subtotal** (obligatorio) | El subtotal de su carrito antes de impuestos, este monto ya debe incluir costos de transportes (shipping) y descuentos. Solo aplican números positivos mayores a cero.                                                                                                                                     |
 | **Taxes** (obligatorio)    | Valor de los impuestos. Aplican cero o números positivos.                                                                                                                                                                                                                                                  |
 | **Total** (obligatorio)    | El monto total a cobrar al cliente. Debe ser la suma de taxes más subtotal. Solo aplican números positivos.                                                                                                                                                                                                |
 | **Order ID** (obligatorio) | Es el número único de pedido generado por su aplicación, por ejemplo un número de pedido o de cliente. Este quedará registrado en el reporte transaccional Banca en Línea Comercial y lo podrá utilizar para conciliar los movimientos. Máximo 15 caracteres alfanuméricos (no se permiten ñ, Ñ o tildes). |
 | **Success URL** (opcional) | Es el URL donde su cliente será regresado o redireccionado en caso de que la transacción sea ejecutada correctamente. Por ejemplo, una página de gracias.                                                                                                                                                  |
 | **Fail URL** (opcional)    | Es el URL donde su cliente será regresado o redireccionado en caso de que el cliente cancele la transacción o suceda un error.                                                                                                                                                                             |


 Si la respuesta es correcta **success: true**, obtendrá la URL para acceder al sitio de pagos de Banco General.

```javascript
{
             "success": true,
             "url": "https://pagosbg.bgeneral.com?{Query
         Params}"
 }
 ```

 En caso de que suceda algún error durante el proceso, **verificar la tabla de códigos de error**.
```javascript
{
"success": false,
"error": {
    "code": "EC-004",
        "message": "El total no cuadra con el
subtotal e impuesto enviado."
}
 }
 ```

 ### 4. Implementación del Botón de Pago Yappy (front-end)
 **4.1)** Primero, importe el módulo de Node de Yappy.

 ```javascript import * as yappy from "yappy-js-sdk";```

 **4.2)** Configure la función **setButton** para personalizar su botón. A continuación se describen los parámetros que recibe la 4 función:

 **donation:** permite reemplazar el botón de pago por uno para donaciones. Los valores pueden ser true or false.

 **formId:** el nombre del formulario que el botón utilizará para realizar el envío (submit).

 **buttonType:** permite seleccionar el estilo del Botón de Pago Yappy. Las opciones son 'brand', 'dark', 'light', 'white'.

```javascript
yappy.setButton(false,'<id de tu form>','brand');
```

**4.3)** Para mostrar el Botón de Pago Yappy en su aplicación, coloque lo siguiente en su HTML:
```
<!-- Contenedor donde se mostrara el Botón de Pago Yappy -->
 <div id=“Yappy_Checkout_Button”></div>
 ```
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

#### Personalización del Botón de Pago Yappy

Opcionalmente, puede seleccionar el color del botón que se ajuste mejor al estilo de su tienda. Recomendamos la opción predeterminada.

### 5. Configuración de notificación instantánea de pago (opcional)

El Botón de Pago Yappy le permite a su servidor recibir el estado de las transacciones. Esta comunicación permite cerrar el ciclo de su pedido y automatizar los procesos de venta.

La función **validateHash** se utiliza para validar la información que envía el banco y actualizar el estado del pedido en su aplicación. El Banco le enviará un mensaje de confirmación a su servidor (por ejemplo: https://mitienda.com/pagosbg) de manera asíncrona al flujo de la transacción.

El estado del pedido se puede encontrar en los query params en la variable **status**. Este query param puede devolver uno de los siguientes estados:

- "E" para **Ejecutado**. El cliente confirmó el pago y se completó la compra.
- "R" para **Rechazado**. Cuando el cliente no confirma el pago dentro de los cinco minutos que dura la vida del pedido.
- "C" para **Cancelado**. El cliente inició el proceso, pero canceló el pedido en el app de Banco General.

 >Nota: El Banco también le notificará el estado exitoso de un pedido por medio de una confirmación enviada por correo electrónico.

 A continuación se encuentra un ejemplo de su implementación en *Express:* **JavaScript**

```javascript
app.post(
"/api/pagosbg",
(req,res)=> {
const success = yappyClient.validateHash(req.query);
if(success){
//your business logic
    }
  }
);
```

Si la variable **success = true**, significa que la transacción fue exitosa y puede continuar con su proceso de negocio.

>Nota: Es importante que la ruta del endpoint tenga el formato “/api/pagosbg” por ser la ruta a la que apuntará el Banco.

### 6.Conexión de prueba
El modo de pruebas permite simular transacciones utilizando números de teléfono de prueba para visualizar el flujo de compra
sin realizar un pedido real. Debe tener en cuenta que:
- El modo de pruebas **sólo funciona con los números de teléfono de pruebas** (se detallan a continuación).
- Recuerde deshabilitar el modo de pruebas para aceptar transacciones reales.

| 6000-0000                | 6000-0002                |
|:------------------------:|:------------------------:|
| Transacciones realizadas | Transacciones canceladas |


Para **encender el modo de pruebas** es necesario colocar true como tercer parámetro de la función cuando obtenga el URL para ir al minisitio (sitio de pagos de Banco General):

>const response = await yappyClient.getPaymentUrl(payment,true, true); //Para donaciones

De esta manera, cada vez que se realice un pago, estará en el modo de prueba y no se debitará de su cuenta.

>Nota: Si el último parámetro esta vacío, el modo de pruebas estará apagado.

| Código de error | Descripción                                            |
|-----------------|--------------------------------------------------------|
| EC-000          | Error genérico.                                        |
| EC-001          | Dominio con formato incorrecto.                        |
| EC-002          | Credenciales inválidas.                                |
| EC-003          | No hay certificado SSL en el dominio.                  |
| EC-004          | El total no cuadra con el subtotal e impuesto enviado. |
| EC-005          | Formato del total inválido.                            |
| EC-006          | Formato del subtotal inválido.                         |
| EC-007          | Formato de impuesto inválido.                          |
| EC-008          | Formato de descuento inválido.                         |
| EC-009          | Formato de shipping inválido.                          |


## Preguntas frecuentes
**1. Como comercio, ¿recibiré alguna notificación de las compras realizadas por Yappy?**

Sí. Cada vez que se realice una compra por Yappy, recibirá un correo de confirmación con el número de pedido, el monto, la hora de la transacción, el número de confirmación de la transacción y el nombre del cliente. Como método opcional, el comercio puede recibir una notificación instantánea de pago (ir al paso 7).

**2. ¿Dónde puedo conseguir mis credenciales para el Botón de Pago Yappy?**

Sus credenciales las puede conseguir en Banca en Línea Comercial. Siga este enlace para verificar los pasos de generación de credenciales.

**3.Veo un mensaje que dice “Algo salió mal, contacta al administrador.” ¿Qué debo hacer?**

- Asegúrese de que su sitio web cumple con los requerimientos mínimos.

- Revise que cuenta con la versión más reciente del módulo.

- Confirme que sus credenciales son correctas y que fueron colocadas en los campos correspondientes.

- Confirmar que el URL de su tienda está registrado correctamente en el perfil de su Botón de Pago Yappy en Banca en Línea Comercial.

**4. ¿Dónde puedo ver reportes de ventas de mi Botón de Pago Yappy?**

Las ventas del Botón de Pago se verán reflejadas en su Banca en Línea Comercial. Acceda a las mismas desde Reportes > Reportes Yappy.

## Resolución de problemas

¿Tiene algún problema? Siga estos pasos para asegurar la correcta configuración de la extensión:
- Asegúrese que su sitio cumple con los requerimientos mínimos.
- Revise que cuenta con la versión más reciente del módulo.
- Revise las preguntas frecuentes por si su pregunta se ve reflejada en las mismas.
- Confirme que sus credenciales son correctas y que fueron colocadas en los campos correspondientes.
- Confirme que no está habilitado el modo de pruebas (sandbox).
- Revise que el dominio de su tienda (URL) sea igual al que definió en su perfil de Botón de Pago en Banca en Línea Comercial, ya que se utilizará para validar la solicitud.

## ¿Tiene alguna pregunta?
Consulte nuestra sección de Preguntas Frecuentes o de Resolución de problemas para resolver los inconvenientes más comunes. Si requiere mayor soporte, comuníquese con nosotros por correo electrónico a botondepagoyappy@bgeneral.com.
