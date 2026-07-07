import { useEffect, useState } from 'react';
import { mapaService } from '../services/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

// API limpia sin espacios accidentales
const API = () => (import.meta.env.VITE_API_URL || 'http://localhost:8081/api').trim();

// Convierte una URL de imagen pública a base64
const toBase64 = (url) =>
  fetch(url)
    .then(r => r.blob())
    .then(blob => new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(blob);
    }));

// Dibuja encabezado institucional en la página actual
const dibujarEncabezado = (doc, W, imgEdu, imgCecyte, imgAdelita) => {
  // Proporciones reales: SEP 2402x494 (r=4.86), CECyTE 1298x378 (r=3.43), Adelita 671x455 (r=1.47)
  if (imgEdu)     doc.addImage(imgEdu,     'PNG',  6,  3, 44, 9);   // 44 x 9
  if (imgCecyte)  doc.addImage(imgCecyte,  'PNG', 54,  3, 31, 9);   // 31 x 9
  if (imgAdelita) doc.addImage(imgAdelita, 'PNG', W - 17, 2, 11, 15); // 11 x 15
  doc.setFontSize(5.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  const lineas = [
    'Subsecretaría de Educación Media Superior',
    'Dirección General de Educación',
    'Tecnológica Industrial y de Servicios',
    'Coordinación de Organismos Descentralizados',
    'Estatales de los CECyTE',
  ];
  lineas.forEach((l, i) => doc.text(l, W - 19, 4 + i * 2.9, { align: 'right' }));
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.25);
  doc.line(6, 19, W - 6, 19);
};

// Dibuja pie de página institucional
const dibujarPie = (doc, W, H, imgMargarita) => {
  // Margarita 4321x1800 (r=2.4) -> 28 x 11.5
  const pieY = H - 20;
  if (imgMargarita) doc.addImage(imgMargarita, 'PNG', 6, pieY - 1, 28, 11.5);
  doc.setFillColor(196, 120, 135);
  doc.rect(6, pieY + 11, W - 12, 2.5, 'F');
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(
    'Avenida Viaducto Río de la Piedad, Núm. 551, Colonia Magdalena Mixhuca, Alcaldía Venustiano Carranza, C.P. 15860, Ciudad de México.',
    W / 2, pieY + 15.5, { align: 'center' }
  );
  doc.text(
    'Teléfono: 55 36 00 43 50 Ext. 60545.   www.cecyte.edu.mx',
    W / 2, pieY + 19, { align: 'center' }
  );
};

const exportarPDF = async (filas) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const [imgEdu, imgCecyte, imgAdelita, imgMargarita] = await Promise.all([
    toBase64('/EDUCACION_pdf.png'),
    toBase64('/cecyte.png'),
    toBase64('/Adelita.png').catch(() => null),
    toBase64('/1.1 GobMx_Margarita Maza_fondo claro_H.png').catch(() => null),
  ]);

  // Encabezado primera página
  dibujarEncabezado(doc, W, imgEdu, imgCecyte, imgAdelita);

  autoTable(doc, {
    startY: 23,
    head: [['Colegio', 'Anexos 2024']],
    body: filas.map(d => [d.colegios ?? '—', d.anexos2024 ?? '—']),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [123, 28, 46], textColor: 255, fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 60, halign: 'center' },
    },
    margin: { left: 6, right: 6, top: 23, bottom: 26 },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) dibujarEncabezado(doc, W, imgEdu, imgCecyte, imgAdelita);
      dibujarPie(doc, W, H, imgMargarita);
    },
  });

  // Pie en página 1 (didDrawPage no se llama en la primera página de autoTable)
  dibujarPie(doc, W, H, imgMargarita);

  doc.save('anexos_ejecucion.pdf');
};

const exportarCSV = (filas) => {
  const bom = '\uFEFF';
  const cabecera = 'Colegio,Anexos 2024';
  const cuerpo = filas.map(d =>
    `"${(d.colegios ?? '').replace(/"/g, '""')}","${(d.anexos2024 ?? '').replace(/"/g, '""')}"`
  ).join('\n');
  const blob = new Blob([bom + cabecera + '\n' + cuerpo], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'anexos_ejecucion.csv'; a.click();
  URL.revokeObjectURL(url);
};

const ProgramaAnual = () => {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getAnexos()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const datosFiltrados = datos.filter(d =>
    d.colegios?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirPdf = (colegio) => {
    const url = `${API()}/anexos/pdf/${encodeURIComponent(colegio)}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="tbl-page">
      <div className="tbl-topbar">
        <div className="tbl-title-area">
          <h2>📋 Anexos de Ejecución — Avances por Estado</h2>
          <span className="tbl-badge">{datosFiltrados.length} registros</span>
        </div>
        <div className="tbl-filters">
          <div className="tbl-filter-group">
            <label>🎓 Colegio</label>
            <input
              type="text"
              placeholder="Buscar colegio..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          {busqueda && (
            <button className="tbl-clear-btn" onClick={() => setBusqueda('')}>✕ Limpiar</button>
          )}
          <button className="grafica-link-btn" onClick={() => exportarCSV(datosFiltrados)}>⬇️ Excel</button>
          <button className="grafica-link-btn" style={{ background: '#7b1c2e' }} onClick={() => exportarPDF(datosFiltrados)}>📄 PDF</button>
        </div>
      </div>

      <div className="tbl-wrapper">
        <table className="tbl-main">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Colegios</th>
              <th>Anexos 2024</th>
              <th>Anexos de Ejecución</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={3} className="tbl-empty">No se encontraron resultados</td>
              </tr>
            ) : (
              datosFiltrados.map(row => (
                <tr key={row.id}>
                  <td className="tbl-col-colegio">{row.colegios}</td>
                  <td className="tbl-num">{row.anexos2024 ?? '—'}</td>
                  <td className="tbl-num">
                    <button
                      className="anexo-btn-abrir"
                      onClick={() => abrirPdf(row.colegios)}
                    >
                      📄 Ver PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgramaAnual;
