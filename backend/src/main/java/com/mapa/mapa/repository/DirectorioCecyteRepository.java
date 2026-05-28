package com.mapa.mapa.repository;

import com.mapa.mapa.entity.DirectorioCecyte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DirectorioCecyteRepository extends JpaRepository<DirectorioCecyte, Long> {
    Optional<DirectorioCecyte> findByCct(String cct);
}
