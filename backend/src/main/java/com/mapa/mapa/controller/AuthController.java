package com.mapa.mapa.controller;

import com.mapa.mapa.config.JwtUtil;
import com.mapa.mapa.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Rate limiting: máximo 5 intentos fallidos por IP en 15 minutos
    private static final int MAX_INTENTOS = 5;
    private static final long VENTANA_MS   = 15 * 60 * 1000L;

    private record Intentos(AtomicInteger count, Instant desde) {}
    private final ConcurrentHashMap<String, Intentos> intentosFallidos = new ConcurrentHashMap<>();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String ip = obtenerIp(request);

        if (bloqueado(ip)) {
            return ResponseEntity.status(429).body(Map.of("error", "Demasiados intentos. Intenta en 15 minutos."));
        }

        String username = body.get("username");
        String password = body.get("password");

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Credenciales requeridas"));
        }

        return usuarioRepository.findByUsername(username)
                .filter(u -> u.isActivo() && passwordEncoder.matches(password, u.getPassword()))
                .map(u -> {
                    limpiarIntentos(ip);
                    return ResponseEntity.ok(Map.of(
                            "token",  jwtUtil.generateToken(u.getUsername(), u.getRol()),
                            "nombre", u.getNombre(),
                            "rol",    u.getRol()
                    ));
                })
                .orElseGet(() -> {
                    registrarIntento(ip);
                    return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
                });
    }

    private boolean bloqueado(String ip) {
        Intentos i = intentosFallidos.get(ip);
        if (i == null) return false;
        if (Instant.now().toEpochMilli() - i.desde().toEpochMilli() > VENTANA_MS) {
            intentosFallidos.remove(ip);
            return false;
        }
        return i.count().get() >= MAX_INTENTOS;
    }

    private void registrarIntento(String ip) {
        intentosFallidos.compute(ip, (k, v) -> {
            if (v == null || Instant.now().toEpochMilli() - v.desde().toEpochMilli() > VENTANA_MS)
                return new Intentos(new AtomicInteger(1), Instant.now());
            v.count().incrementAndGet();
            return v;
        });
    }

    private void limpiarIntentos(String ip) {
        intentosFallidos.remove(ip);
    }

    private String obtenerIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        return (forwarded != null && !forwarded.isBlank())
                ? forwarded.split(",")[0].trim()
                : request.getRemoteAddr();
    }
}
