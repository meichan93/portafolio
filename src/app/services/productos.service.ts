import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Producto } from "../interfaces/producto.interface";

@Injectable({
  providedIn: "root"
})
export class ProductosService {
  cargando = true;
  productos: Producto[] = [];
  productosFiltrado: Producto[] = [];

  constructor(private http: HttpClient) {
    this.cargarProductos();
  }

  private cargarProductos() {
    return new Promise((resolve, reject) => {
      this.http
        .get("https://angular-html-e1535.firebaseio.com/productos_idx.json")
        .subscribe((resp: Producto[]) => {
          this.productos = resp;
          this.cargando = false;
          resolve();
        });
    });
  }

  getProducto(id: string) {
    return this.http.get(
      `https://angular-html-e1535.firebaseio.com/productos/${id}.json`
    );
    // para insertar una variable en un url, se deben poner--> `url` e insertar la variable dentro ${id} [Example]
  }

  buscarProducto(termino: string) {
    if (this.productos.length === 0) {
      this.cargarProductos().then(() => {
        // ejecutar despues de tener productos
        // app filtro
        this.filtrarProductos(termino);
      });
    } else {
      this.filtrarProductos(termino);
    }
  }

  private filtrarProductos(termino: string) {
    this.productosFiltrado = [];
    termino = termino.toLocaleLowerCase();
    this.productos.forEach(prod => {
      const titulo = prod.titulo.toLocaleLowerCase();
      if (
        prod.categoria.indexOf(termino) >= 0 ||
        titulo.indexOf(termino) >= 0
      ) {
        this.productosFiltrado.push(prod);
      }
    });
  }
}
