const productosEmpleadosDOM = document.getElementById('productosEmpleado')
const botonAgregarProducto = document.getElementById('agregarProducto')
const rutaJSON = '../js/productos.json'


botonAgregarProducto.addEventListener('click', async () => {
    let nombreProducto = await obtenerTexto()
    let precioProducto = await obtenerNumero("Ingresa el precio", "Por favor ingresa el precio del producto:");
    let stockProducto= await obtenerNumero("Ingresa la cantidad de stock", "Por favor ingresa la cantidad de stock:");
    let productoNuevo = new Producto("../assets/imagen.png", productos.length+1, nombreProducto.toUpperCase(), precioProducto, stockProducto)
    productos.push(productoNuevo)
    cargarProductoEditar()
});



function activarClickEnBotonesEliminarProducto(){
    const botonesEliminar = document.querySelectorAll('.eliminarProducto')
    for (const boton of botonesEliminar) {
        boton.addEventListener('click', () => {
            const indexProductoSeleccionado = productos.findIndex((producto) => 'eliminar' + producto.codigo === (boton.id)) 
            productos.splice(indexProductoSeleccionado, 1)
            cargarProductoEditar()
        })
    }
}

function activarClickEnBotonesEditarNombre(){
    const botonesEditar = document.querySelectorAll('.editarNombre')
    for (const boton of botonesEditar) {
        boton.addEventListener('click', async() => {
            const ProductoSeleccionado = productos.find((producto) => 'editarNombre' + producto.codigo === (boton.id)) 
            let nombreNuevo = await obtenerTexto()
            if(nombreNuevo.trim() !== ''){
                ProductoSeleccionado.nombre = nombreNuevo.trim().toUpperCase()
            }
            cargarProductoEditar()
        })
    }
}

function activarClickEnBotonesEditarPrecio(){
    const botonesEditar = document.querySelectorAll('.editarPrecio')
    for (const boton of botonesEditar) {
        boton.addEventListener('click', async() => {
            const ProductoSeleccionado = productos.find((producto) => 'editarPrecio' + producto.codigo === (boton.id)) 
            let precioNuevo = await obtenerNumero("Ingresa el precio", "Por favor ingresa el precio del producto:");
            
            if (!isNaN(precioNuevo) && (precioNuevo>0)){
                precioNuevo = precioNuevo.trim()
                ProductoSeleccionado.precio = precioNuevo
            }
            cargarProductoEditar()
        })
    }
}

function activarClickEnBotonesEditarStock(){
    const botonesEditar = document.querySelectorAll('.editarStock')
    for (const boton of botonesEditar) {
        boton.addEventListener('click', async() => {
            const ProductoSeleccionado = productos.find((producto) => 'editarStock' + producto.codigo === (boton.id)) 
            let stockNuevo = await obtenerNumero("Ingresa el precio", "Por favor ingresa el precio del producto:");
            if (!isNaN(stockNuevo) && stockNuevo>=0){
                stockNuevo = stockNuevo.trim()
                ProductoSeleccionado.stock = stockNuevo
            }
            cargarProductoEditar()
        })
    }
}

function mostrarProductoEditar(producto){
    return `<div class="productoEditar">
                <div class="cardProductoEditar">
                    <div class="imagenEditar">
                        <div class="imagenProducto">
                            <img src="${producto.imagen}" alt="">
                        </div>
                    </div>
                    <div class="nombreEditar">
                        <div class="nombreProducto">
                            <h3>${producto.nombre}</h3>
                        </div>
                        <div class="imagenArriba">
                            <img class="icono editarNombre" id="editarNombre${producto.codigo}" src="../assets/editar.png" alt="">
                        </div>
                    </div>
                    <div class="precioEditar">
                        <div>
                            <h3 class="precioProducto">$${producto.precio}</h3>
                        </div>
                        <div class="imagenArriba">
                            <img class="icono editarPrecio" id="editarPrecio${producto.codigo}" src="../ASSETS/editar.png" alt="">
                        </div>
                    </div>
                    <div class="stockEditar">
                        <div class="stockProducto">
                            <h3>Stock</h3>
                            <div class="circuloStock">
                                <h3>${producto.stock}</h3>
                            </div>
                        </div>
                        <div class="imagenArriba">
                            <img class="icono editarStock" id="editarStock${producto.codigo}" src="../assets/editar.png" alt="">
                        </div>
                    </div>
                </div>
                <div class="basura">
                    <img class="icono eliminarProducto" id="eliminar${producto.codigo}" src="../assets/basura.png" alt="">
                </div>
            </div>`
}

function cargarProductoEditar(){
    if(productos.length >= 0){
        productosEmpleadosDOM.innerHTML = ''
        productos.forEach((producto) => {
            productosEmpleadosDOM.innerHTML += mostrarProductoEditar(producto)
            activarClickEnBotonesEliminarProducto()
            activarClickEnBotonesEditarNombre()
            activarClickEnBotonesEditarPrecio()
            activarClickEnBotonesEditarStock()
        })
    }
}


function mostrarError(error){
    return `<div id="error">
                <div>
                    <img src="../assets/cruz.png" alt="Error">
                </div>
                <div class="textoError">
                    <h3>Error al obtener productos</h3>
                    <h4>${error}</h4>
                </div>
            </div>`
}

function obtenerProductos(){
    fetch(rutaJSON)
    .then((response)=> {
        if(response.ok){
            return response.json()
        }else{
            throw new Error(response.status)
        }
    })
    .then((data) => productos.push(...data))
    .then(()=> cargarProductoEditar(productos))
    .catch((error) => {productosEmpleadosDOM.innerHTML = mostrarError(error)})
}

obtenerProductos()

async function obtenerNumero(titulo, texto) {
    const { value: numero } = await Swal.fire({
      title: titulo,
      text: texto,
      input: "number",
      inputLabel: "Número",
      inputValidator: (value) => {
        if (!value) {
          return "Debes ingresar un número";
        }
        if (isNaN(value) || parseInt(value) < 0) {
          return "Por favor ingresa un número no negativo";
        }
      }
    });
  
    if (numero !== undefined) {
      return numero;
    }
}

async function obtenerTexto() {
    const { value: nombre } = await Swal.fire({
      title: 'Ingrese el nombre del producto',
      text: 'Por favor ingrese el nombre del producto',
      input: "text",
      inputLabel: "Texto",
      inputValidator: (value) => {
        if (!value) {
          return "Necesitas escribir algo!";
        }
      }
    });
  
    if (nombre) {
      return nombre;
    }
}
