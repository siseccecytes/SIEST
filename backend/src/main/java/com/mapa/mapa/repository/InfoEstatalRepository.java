package com.mapa.mapa.repository;

import com.mapa.mapa.entity.InfoEstatal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InfoEstatalRepository extends JpaRepository<InfoEstatal, Long> {
    Optional<InfoEstatal> findByColegio(String colegio);

    @Query("SELECT DISTINCT i.colegio FROM InfoEstatal i WHERE i.colegio IS NOT NULL")
    List<String> findColegiosDistintos();
}
