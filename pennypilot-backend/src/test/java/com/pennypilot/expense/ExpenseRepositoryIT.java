package com.pennypilot.expense;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for ExpenseRepository running against a real PostgreSQL instance via Testcontainers.
 */
@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ExpenseRepositoryIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("pennypilot_test")
            .withUsername("pennypilot")
            .withPassword("pennypilot");

    @Autowired
    private ExpenseRepository expenseRepository;

    @Test
    void contextLoads() {
        assertThat(expenseRepository).isNotNull();
    }

    @Test
    void findAll_whenEmpty_shouldReturnEmptyList() {
        assertThat(expenseRepository.findAll()).isEmpty();
    }
}
