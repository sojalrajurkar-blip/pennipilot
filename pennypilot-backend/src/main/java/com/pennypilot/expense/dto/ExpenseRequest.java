package com.pennypilot.expense.dto;

import com.pennypilot.expense.ExpenseCategory;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request DTO used for both creating and updating an expense.
 */
public record ExpenseRequest(

        @NotBlank(message = "title must not be blank")
        @Size(max = 150, message = "title must not exceed 150 characters")
        String title,

        @NotNull(message = "amount must not be null")
        @DecimalMin(value = "0.01", message = "amount must be greater than 0")
        BigDecimal amount,

        @NotNull(message = "category must not be null")
        ExpenseCategory category,

        @NotNull(message = "expenseDate must not be null")
        @PastOrPresent(message = "expenseDate must not be in the future")
        LocalDate expenseDate,

        @Size(max = 500, message = "description must not exceed 500 characters")
        String description
) {}
