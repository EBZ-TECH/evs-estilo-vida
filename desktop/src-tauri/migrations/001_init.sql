CREATE TABLE IF NOT EXISTS informes (
  id TEXT PRIMARY KEY,
  guardado_en TEXT NOT NULL,
  nombre TEXT NOT NULL,
  edad TEXT,
  valor_imc REAL,
  etiqueta_imc TEXT,
  estadio_codigo TEXT,
  estadio_titulo TEXT,
  version_instrumento TEXT NOT NULL,
  informe_json TEXT NOT NULL,
  respuestas_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_informes_nombre ON informes(nombre);
CREATE INDEX IF NOT EXISTS idx_informes_guardado_en ON informes(guardado_en DESC);

CREATE TABLE IF NOT EXISTS config_seguridad (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  actualizado_en TEXT NOT NULL
);
