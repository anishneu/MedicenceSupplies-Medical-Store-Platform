package com.medicence.supplies.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.medicence.supplies.domain.Medication;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class MedicationRepositoryTest {

    @Autowired
    private MedicationRepository medicationRepository;

    @Test
    void findsLowStock() {
        medicationRepository.save(new Medication("A", "Cat", new BigDecimal("1.00"), 5));
        medicationRepository.save(new Medication("B", "Cat", new BigDecimal("2.00"), 25));

        assertThat(medicationRepository.findByStockLessThan(20))
                .extracting(Medication::getName)
                .containsExactly("A");
    }
}
