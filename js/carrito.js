const carritoDom = document.getElementById('productosCarrito');
const gifCargando = '<img src="../assets/cargando.gif">';

function mostrarProductoCarrito(producto) {
    return `<div>
                <div class="productoCarrito">
                    <div><img src="../${producto.imagen}" alt=""></div>
                    <div><h4>${producto.nombre}</h4></div>
                    <div class="cantidadProductos">
                        <div class="menos" id="menos${producto.codigo}" class="mas"><h4>-</h4></div>
                        <div>
                            <h4 class="cantidadProductosNumero">${producto.cantidadCarrito}</h4>
                        </div>
                        <div class="mas" id="mas${producto.codigo}" class="menos"><h4>+</h4></div>
                    </div>
                    <div><h4>$${producto.precio*producto.cantidadCarrito}</h4></div>
                </div>
                <img id="eliminar${producto.codigo}" class="eliminarDelCarrito" src="../ASSETS/Cruz.png" alt="">
            </div>`;
}

function actualizarDatos(){
    localStorage.setItem('miCarrito', JSON.stringify(carrito));
    localStorage.setItem('misProductos', JSON.stringify(productos));
    cargarProductosCarrito(carrito);
    mostrarTotal();
}

function activarClickEnBotonesSumar() {
    const botonesSumar = document.querySelectorAll('.mas');
    for (let boton of botonesSumar) {
        boton.addEventListener('click', () => {
            const productoSeleccionado = carrito.find((producto) => 'mas' + producto.codigo === (boton.id));
            const productoSeleccionadoProductos = productos.find((producto) => 'mas' + producto.codigo === (boton.id));
            if (!hayStock(productoSeleccionado)) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "No hay stock",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                productoSeleccionado.cantidadCarrito++;
                productoSeleccionado.stock--;
                productoSeleccionadoProductos.stock --;
                actualizarDatos()
            }
        });
    }
}

function activarClickEnBotonesRestar() {
    const botonesRestar = document.querySelectorAll('.menos');
    for (let boton of botonesRestar) {
        boton.addEventListener('click', () => {
            const productoSeleccionado = carrito.find((producto) => 'menos' + producto.codigo === (boton.id));
            const productoSeleccionadoProductos = productos.find((producto) => 'menos' + producto.codigo === (boton.id));
            if (productoSeleccionado.cantidadCarrito > 1){
                productoSeleccionado.cantidadCarrito--;
                productoSeleccionado.stock++;
            }else{
                const indiceProductoSeleccionadoCarrito = carrito.findIndex((producto) => 'menos' + producto.codigo === (boton.id));
                carrito.splice(indiceProductoSeleccionadoCarrito,1)
            }
            productoSeleccionadoProductos.stock++;
            actualizarDatos()
        });
    }
}

function activarClickEnBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll('.eliminarDelCarrito');
    for (let boton of botonesEliminar) {
        boton.addEventListener('click', () => {
            const productoSeleccionadoCarrito = carrito.find((producto) => 'eliminar' + producto.codigo === (boton.id));
            const productoSeleccionado = productos.find((producto) => 'eliminar' + producto.codigo === (boton.id));
            if (productoSeleccionadoCarrito) {
                productoSeleccionado.stock += productoSeleccionadoCarrito.cantidadCarrito;
                const indiceProductoSeleccionadoCarrito = carrito.findIndex((producto) => 'eliminar' + producto.codigo === (boton.id));
                carrito.splice(indiceProductoSeleccionadoCarrito,1)
                actualizarDatos()
            }
        });
    }
}

function activarClickEnBotonPagar() {
    const botonPagar = document.getElementById('pagar');
    botonPagar.addEventListener('click', () => {
        if (carrito.length > 0) {
            botonPagar.innerHTML = gifCargando;
            setTimeout(() => {
                carrito.splice(0, carrito.length);
                carritoDom.innerHTML = '';
                mostrarTotal();
                botonPagar.innerHTML = 'Pagar';
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Tu compra se realizó con éxito",
                    showConfirmButton: false,
                    timer: 1500
                });
                localStorage.setItem('miCarrito', []);
                localStorage.setItem('misProductos', JSON.stringify(productos));
                setTimeout(() => {
                    cargarProductosCarrito();
                }, 2000);
            }, 3000);
        }

    });
}

function mostrarTotal() {
    let precioTotal = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidadCarrito), 0);
    const total = document.getElementById('precioTotal');
    total.innerHTML = '$' + precioTotal.toFixed(0); // Redondear el total a dos decimales
}

function cargarProductosCarrito(array) {
    carritoDom.innerHTML = "";
    array.forEach((producto) => {
        if (producto.cantidadCarrito > 0){
            carritoDom.innerHTML += mostrarProductoCarrito(producto);
        }else{
            location.href = '../html/cliente.html'
        }
        activarClickEnBotonesSumar();
        activarClickEnBotonesRestar();
        activarClickEnBotonesEliminar();
        mostrarTotal();
        activarClickEnBotonPagar();
    });
}

const datosCarrito = localStorage.getItem('miCarrito');
const datosProductos = localStorage.getItem('misProductos');
carrito = datosCarrito ? JSON.parse(datosCarrito) : [];
productos = datosProductos ? JSON.parse(datosProductos) : [];
console.table(carrito)
cargarProductosCarrito(carrito);


