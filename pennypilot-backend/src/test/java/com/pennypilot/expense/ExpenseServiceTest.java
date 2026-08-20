package com.pennypilot.expense;

import com.pennypilot.expense.dto.ExpenseRequest;
import com.pennypilot.expense.dto.ExpenseResponse;
import com.pennypilot.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ExpenseServiceImpl using Mockito.
 */
@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private ExpenseMapper expenseMapper;

    @InjectMocks
    private ExpenseServiceImpl expenseService;

    @Test
    void createExpense_shouldSaveAndReturnResponse() {
        // TODO: implement test
    }

    @Test
    void getExpenseById_whenNotFound_shouldThrowResourceNotFoundException() {
        when(expenseRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> expenseService.getExpenseById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    void deleteExpense_whenNotFound_shouldThrowResourceNotFoundException() {
        when(expenseRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> expenseService.deleteExpense(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
