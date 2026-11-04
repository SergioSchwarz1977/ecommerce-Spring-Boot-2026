package com.ecommerce.tienda.exception;

/**
 * ResourceNotFoundException
 */
public class ProductoNotFoundException extends RuntimeException{

    public ProductoNotFoundException(String message) {
        super(message);
    }

}
