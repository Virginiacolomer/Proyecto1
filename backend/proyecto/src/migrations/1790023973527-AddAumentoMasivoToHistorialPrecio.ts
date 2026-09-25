import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * CR-006: amplía la tabla historial_precio (creada en HU-007) con columnas
 * opcionales para registrar los aumentos masivos. No modifica nada de lo
 * existente: las columnas nuevas son nullable, así que los registros de
 * HU-007 siguen siendo válidos.
 */
export class AddAumentoMasivoToHistorialPrecio1790023973527 implements MigrationInterface {
    name = 'AddAumentoMasivoToHistorialPrecio1790023973527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`historial_precio\` ADD \`lote_id\` varchar(36) NULL, ADD \`tipoAjuste\` enum ('PORCENTAJE', 'MONTO_FIJO') NULL, ADD \`valorAplicado\` decimal(15,5) NULL, ADD \`usuario_created_id\` int NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_historial_precio_lote_id\` ON \`historial_precio\` (\`lote_id\`)`);
        await queryRunner.query(`ALTER TABLE \`historial_precio\` ADD CONSTRAINT \`FK_historial_precio_usuario\` FOREIGN KEY (\`usuario_created_id\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`historial_precio\` DROP FOREIGN KEY \`FK_historial_precio_usuario\``);
        await queryRunner.query(`DROP INDEX \`IDX_historial_precio_lote_id\` ON \`historial_precio\``);
        await queryRunner.query(`ALTER TABLE \`historial_precio\` DROP COLUMN \`usuario_created_id\`, DROP COLUMN \`valorAplicado\`, DROP COLUMN \`tipoAjuste\`, DROP COLUMN \`lote_id\``);
    }

}
