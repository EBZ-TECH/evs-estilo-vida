-- Añade columna cedula al esquema de informes (idempotente para sqlite > 3.35).
-- En SQLite no existe IF NOT EXISTS para ALTER TABLE, así que la migración
-- se aplica tras comprobación en código. El índice sí soporta IF NOT EXISTS.
ALTER TABLE informes ADD COLUMN cedula TEXT;
CREATE INDEX IF NOT EXISTS idx_informes_cedula ON informes(cedula);
