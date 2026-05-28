package com.mapa.mapa.repository;

import com.mapa.mapa.entity.InfoFederal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InfoFederalRepository extends JpaRepository<InfoFederal, Long> {
}
