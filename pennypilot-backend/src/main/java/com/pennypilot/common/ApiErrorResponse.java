package com.pennypilot.common;

import java.time.Instant;
import java.util.List;

/**
 * Standard API error response envelope returned for all failure cases.
 * Matches the error format defined in SRS §10.2.
 */
public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        List<FieldError> fieldErrors
) {
    /**
     * Represents a single field-level validation error.
     */
    public record FieldError(String field, String message) {}
}
