package com.ecommerce.tienda.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {
   
    @ExceptionHandler(ProductoNotFoundException.class)
    public ResponseEntity<ProductoNotFoundException> handleProductoNotFoundException(ProductoNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e);
    }

    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<StockInsuficienteException> handleStockInsuficienteException(StockInsuficienteException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e);
    }

}
