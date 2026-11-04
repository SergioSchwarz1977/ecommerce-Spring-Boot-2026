package com.ecommerce.tienda.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.tienda.entity.Producto;

public interface ProductoRepository  extends JpaRepository<Producto, Long>{

}
