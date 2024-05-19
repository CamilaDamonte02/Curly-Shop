const productosDOM = document.getElementById('productos');

const botonIrAlCarrito = document.getElementById('carrito');

const inputBuscar = document.querySelector('input[type=search]');

const rutaJSON = '../JS/productos.json';

inputBuscar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && inputBuscar.value.trim() !== ''){
        const resultado = productos.filter((producto) => producto.nombre.includes(inputBuscar.value.trim().toUpperCase()));
        resultado.length > 0 ? cargarProductos(resultado) : cargarProductos([]);
    }
});

inputBuscar.addEventListener('input', () => {
    inputBuscar.value.trim() === '' && cargarProductos(productos);
});

botonIrAlCarrito.addEventListener('mousemove', () =>{
    botonIrAlCarrito.title = carrito.length > 0 ? carrito.length + ' producto(s) en el carrito' : 'Ir al carrito';
});

botonIrAlCarrito.addEventListener('click', () =>{
    if (carrito.length > 0){
        location.href = '../HTML/Carrito.html';
    }else{
        Swal.fire({
            title: "Carrito Vacío",
            text: "Tu carrito no tiene ningún producto",
            icon: "warning"
          });
    }
});

function hayStock(producto){
    return producto.stock > 0;
}

function activarClickEnBotonesComprar(){
    const botonesComprar = document.querySelectorAll('button.botonComprar');
    for (let boton of botonesComprar){
        boton.addEventListener('click', ()=>{
            const codigoProducto = parseInt(boton.id);
            const productoSeleccionado = productos.find((producto) => producto.codigo === codigoProducto);  
            let posicion;
            const productoEnCarrito = carrito.find((producto) => producto.codigo === codigoProducto);
            if (productoEnCarrito){
                posicion = carrito.findIndex((producto) => producto.codigo === codigoProducto);
                carrito[posicion].cantidadCarrito ++;
                carrito[posicion].stock --;
                posicion = productos.findIndex((producto) => producto.codigo === codigoProducto);
                productos[posicion].stock --;
            }else{
                posicion = productos.findIndex((producto) => producto.codigo === codigoProducto);
                productos[posicion].stock --;
                const miProducto = new Producto(productoSeleccionado.imagen, productoSeleccionado.codigo, productoSeleccionado.nombre, productoSeleccionado.precio, productoSeleccionado.stock);
                miProducto.cantidadCarrito = 1;
                carrito.push(miProducto);
                posicion = carrito.findIndex((producto) => producto.codigo === codigoProducto);
            }
            localStorage.setItem('miCarrito', JSON.stringify(carrito));
            localStorage.setItem('misProductos', JSON.stringify(productos));
            cargarProductos(productos);
            
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 800,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Producto agregado al carrito"
            });
        });
    }
}

function mostrarProducto(producto) {
    return `<div class="producto">
                <div><img src="${producto.imagen}" alt=""></div>
                <h3>${producto.nombre}</h3>
                <button id="${producto.codigo}" class="botonComprar">Comprar</button>
            </div>`;
}

function errorSinResultados(){
    return `<div id="error">
                <div>
                    <img src="../ASSETS/Sin resultados.png" alt="No hay resultados">
                </div>
                <div class="textoError">
                    <h3>No se han encontrado resultados de tu busqueda</h3>
                    <h4>Prueba con otra cosa...</h4>
                </div>
            </div>`;
}

function mostrarError(error){
    return `<div id="error">
                <div>
                    <img src="../ASSETS/cruz.png" alt="Error">
                </div>
                <div class="textoError">
                    <h3>Error al obtener productos</h3>
                    <h4>${error}</h4>
                </div>
            </div>`;
}

function cargarProductos(array){
    if (array.length > 0){
        productosDOM.innerHTML = "";
        array.forEach((producto) => {
            if (producto.stock > 0){
                productosDOM.innerHTML += mostrarProducto(producto);
            }
        });
        activarClickEnBotonesComprar();
    }else{
        productosDOM.innerHTML = errorSinResultados();
    }
}

function obtenerProductos(){
    fetch(rutaJSON)
    .then((response)=> {
        if(response.ok){
            return response.json();
        }else{
            throw new Error(response.status);
        }
    })
    .then((data) => {
        productos = [];
        productos.push(...data);
        cargarProductos(productos);
    })
    .catch((error) => {
        productosDOM.innerHTML = mostrarError(error);
    });
}



let productosJSON = localStorage.getItem('misProductos');

productos = productosJSON !== null ? JSON.parse(productosJSON) : [];

obtenerProductos();
