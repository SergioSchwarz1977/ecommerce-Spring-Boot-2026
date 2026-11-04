package com.ecommerce.tienda.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.ecommerce.tienda.entity.Producto;
import com.ecommerce.tienda.repository.ProductoRepository;

@Service 
public class ProductoService {

    ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public Producto saveProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto updateProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }

    public Producto getProductoById(Long id) {
        return productoRepository.findById(id).orElse(null);
    }


}
