import { useState, useEffect } from 'react';

const TAMANIO = 20;

export const usePaginacion = (datos) => {
  const [pagina, setPagina] = useState(1);

  // Resetear a página 1 cuando cambian los datos filtrados
  useEffect(() => { setPagina(1); }, [datos.length]);

  const totalPaginas = Math.max(1, Math.ceil(datos.length / TAMANIO));
  const inicio = (pagina - 1) * TAMANIO;
  const paginados = datos.slice(inicio, inicio + TAMANIO);

  return { paginados, pagina, setPagina, totalPaginas, inicio };
};

export const Paginacion = ({ pagina, totalPaginas, setPagina, total, inicio, tamanio = TAMANIO }) => {
  if (totalPaginas <= 1) return null;

  const fin = Math.min(inicio + tamanio, total);

  // Generar rango de páginas visibles
  const rango = [];
  const delta = 2;
  for (let i = Math.max(1, pagina - delta); i <= Math.min(totalPaginas, pagina + delta); i++) {
    rango.push(i);
  }

  return (
    <div className="pag-bar">
      <span className="pag-info">
        Mostrando {inicio + 1}–{fin} de {total} registros
      </span>
      <div className="pag-controles">
        <button className="pag-btn" onClick={() => setPagina(1)}        disabled={pagina === 1}>«</button>
        <button className="pag-btn" onClick={() => setPagina(p => p-1)} disabled={pagina === 1}>‹</button>
        {rango[0] > 1 && <span className="pag-ellipsis">…</span>}
        {rango.map(n => (
          <button
            key={n}
            className={`pag-btn ${n === pagina ? 'pag-btn-active' : ''}`}
            onClick={() => setPagina(n)}
          >{n}</button>
        ))}
        {rango[rango.length - 1] < totalPaginas && <span className="pag-ellipsis">…</span>}
        <button className="pag-btn" onClick={() => setPagina(p => p+1)} disabled={pagina === totalPaginas}>›</button>
        <button className="pag-btn" onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}>»</button>
      </div>
    </div>
  );
};
