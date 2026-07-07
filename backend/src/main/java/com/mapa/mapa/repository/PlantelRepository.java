package com.mapa.mapa.repository;

import com.mapa.mapa.dto.PlantelMapaDTO;
import com.mapa.mapa.entity.Plantel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlantelRepository extends JpaRepository<Plantel, Long> {
    List<Plantel> findByTipo(String tipo);
    List<Plantel> findByCct(String cct);

    @Query(value = """
            SELECT p.id, p.colegio, p.cct, p.tipo, p.nombre_del_plantel,
                   p.eficiencia_terminal_2024_2025, p.desafiliacion_escolar_2024_2025,
                   p.reprobacion_2024_2025, p.matricula_2025_2026,
                   COALESCE(c.latitud, e.latitud)   AS latitud,
                   COALESCE(c.longitud, e.longitud) AS longitud,
                   COALESCE(c.direccion, e.direccion) AS direccion
            FROM planteles p
            LEFT JOIN directorio_cecyte c ON c.cct = p.cct AND c.latitud IS NOT NULL
            LEFT JOIN directorio_emsad  e ON e.cct = p.cct AND e.latitud IS NOT NULL
            WHERE UPPER(p.colegio) = UPPER(:colegio)
              AND COALESCE(c.latitud, e.latitud) IS NOT NULL
            """, nativeQuery = true)
    List<Object[]> findPlantelesByColegioWithCoordenadas(@Param("colegio") String colegio);
}
