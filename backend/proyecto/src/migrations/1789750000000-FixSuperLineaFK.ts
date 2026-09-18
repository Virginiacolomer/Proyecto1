import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Migración de REPARACIÓN idempotente.
 * 
 * Contexto: La migración AddSuperLinea1787269586539 tenía un .catch(() => {})
 * que tragaba silenciosamente el error al crear la FK. En máquinas donde la
 * columna super_linea_id fue creada por otra migración (ej: AddPresentacionToProducto)
 * con datos huérfanos, la FK falló pero la migración se marcó como ejecutada.
 *
 * Esta migración:
 * - Es segura para correr en CUALQUIER máquina (haya fallado o no la anterior)
 * - Verifica cada paso antes de ejecutarlo (idempotente)
 * - No hace nada si todo ya está correcto
 */
export class FixSuperLineaFK1789750000000 implements MigrationInterface {
    name = 'FixSuperLineaFK1789750000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Asegurar que la tabla super_linea existe
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`super_linea\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`denominacion\` varchar(255) NOT NULL,
                \`observacion\` text NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deletedAt\` datetime(6) NULL,
                \`usuarioCreatedId\` int NULL,
                \`usuarioDeletedId\` int NULL,
                \`usuarioUpdatedId\` int NULL,
                \`sistema\` int NOT NULL DEFAULT '0',
                UNIQUE INDEX \`IDX_superlinea_denominacion_deletedAt\` (\`denominacion\`, \`deletedAt\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB
        `);

        // 2. Asegurar que existe la SuperLínea por defecto "GENERAL"
        await queryRunner.query(`
            INSERT INTO \`super_linea\` (\`id\`, \`denominacion\`, \`observacion\`, \`sistema\`)
            SELECT 1, 'GENERAL', 'SuperLínea por defecto', 1
            WHERE NOT EXISTS (SELECT 1 FROM \`super_linea\` WHERE \`id\` = 1)
        `);

        // 3. Asegurar que la columna super_linea_id existe en linea
        const hasColumn = await queryRunner.hasColumn('linea', 'super_linea_id');
        if (!hasColumn) {
            await queryRunner.query(`
                ALTER TABLE \`linea\` ADD COLUMN \`super_linea_id\` int NOT NULL DEFAULT 1
            `);
        }

        // 4. Limpiar TODOS los datos huérfanos (causa raíz del fallo original)
        await queryRunner.query(`
            UPDATE \`linea\` 
            SET \`super_linea_id\` = 1 
            WHERE \`super_linea_id\` IS NULL 
               OR \`super_linea_id\` = 0 
               OR \`super_linea_id\` NOT IN (SELECT \`id\` FROM \`super_linea\`)
        `);

        // 5. Crear FK solo si no existe
        const fkExists = await queryRunner.query(`
            SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
            WHERE CONSTRAINT_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'linea' 
            AND CONSTRAINT_NAME = 'FK_linea_super_linea'
        `);

        if (fkExists[0].cnt === 0) {
            await queryRunner.query(`
                ALTER TABLE \`linea\` 
                ADD CONSTRAINT \`FK_linea_super_linea\` 
                FOREIGN KEY (\`super_linea_id\`) REFERENCES \`super_linea\`(\`id\`) 
                ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Esta migración es de reparación, no revierte nada.
        // El rollback completo de SuperLínea lo maneja AddSuperLinea.down()
    }
}
