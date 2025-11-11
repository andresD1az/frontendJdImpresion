package com.jdimpresion.validators;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Suite de pruebas para validación de correos electrónicos
 * en el módulo de pagos del sistema JD Impresión.
 * 
 * @author Equipo JD Impresión
 * @version 1.0
 */
@DisplayName("Email Validator Tests")
class EmailValidatorTest {

    private final EmailValidator emailValidator = new EmailValidator();

    @Test
    @DisplayName("AP01 - Debe rechazar correo electrónico con formato inválido")
    void testInvalidEmailFormat() {
        // Arrange
        String invalidEmail = "correo.invalido@";
        
        // Act
        ValidationResult result = emailValidator.validate(invalidEmail);
        
        // Assert
        assertFalse(result.isValid(), "El correo debería ser inválido");
        assertEquals("Formato de correo inválido", result.getErrorMessage());
        assertEquals("EMAIL_FORMAT_INVALID", result.getErrorCode());
    }

    @ParameterizedTest
    @DisplayName("Debe rechazar múltiples formatos inválidos de correo")
    @ValueSource(strings = {
        "correo.sin.arroba.com",
        "@sinusuario.com",
        "correo@",
        "correo @espacios.com",
        "correo@dominio",
        "correo@@doble.com",
        "correo@.com"
    })
    void testMultipleInvalidEmails(String email) {
        // Act
        ValidationResult result = emailValidator.validate(email);
        
        // Assert
        assertFalse(result.isValid(), 
            "El correo '" + email + "' debería ser inválido");
    }

    @ParameterizedTest
    @DisplayName("Debe aceptar formatos válidos de correo")
    @ValueSource(strings = {
        "usuario@ejemplo.com",
        "nombre.apellido@empresa.cl",
        "contacto123@dominio.co",
        "info@sub.dominio.com"
    })
    void testValidEmails(String email) {
        // Act
        ValidationResult result = emailValidator.validate(email);
        
        // Assert
        assertTrue(result.isValid(), 
            "El correo '" + email + "' debería ser válido");
        assertNull(result.getErrorMessage());
    }

    @Test
    @DisplayName("Debe rechazar correo nulo")
    void testNullEmail() {
        // Act
        ValidationResult result = emailValidator.validate(null);
        
        // Assert
        assertFalse(result.isValid());
        assertEquals("Email no puede ser nulo", result.getErrorMessage());
    }

    @Test
    @DisplayName("Debe rechazar correo vacío")
    void testEmptyEmail() {
        // Act
        ValidationResult result = emailValidator.validate("");
        
        // Assert
        assertFalse(result.isValid());
        assertEquals("Email no puede estar vacío", result.getErrorMessage());
    }
}
