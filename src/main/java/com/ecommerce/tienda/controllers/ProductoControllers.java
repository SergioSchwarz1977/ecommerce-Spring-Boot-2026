package com.ecommerce.tienda.controllers;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ecommerce.tienda.entity.Producto;
import com.ecommerce.tienda.service.ProductoService;

@RestController
@RequestMapping("/productos")
public class ProductoControllers {

    ProductoService productoService;

    public ProductoControllers(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Producto>> getAllProductos() {
        return ResponseEntity.ok(productoService.getAllProductos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        Producto producto = productoService.getProductoById(id);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(producto);
    }

    @PostMapping("/crear")
    public ResponseEntity<Producto> saveProducto(@RequestBody Producto producto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.saveProducto(producto));
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
        Producto productoActual = productoService.getProductoById(id);
        if (productoActual == null) {
            return ResponseEntity.notFound().build();
        }
        productoActual.setNombre(producto.getNombre());
        productoActual.setDescripcion(producto.getDescripcion());
        productoActual.setCategoria(producto.getCategoria());
        productoActual.setPrecio(producto.getPrecio());
        productoActual.setStock(producto.getStock());
        return ResponseEntity.ok(productoService.updateProducto(productoActual));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }
}