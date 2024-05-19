class Producto {
    constructor(imagen, codigo, nombre, precio, stock) {
        this.imagen = imagen;
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.cantidadCarrito = 0;
    }
}

let productos = []

let carrito = []