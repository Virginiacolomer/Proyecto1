import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCamposProducto1790089632077 implements MigrationInterface {
    name = 'RemoveCamposProducto1790089632077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3a128605de9529f2d6a916f8f3\` ON \`producto\``);
        await queryRunner.query(`CREATE TABLE \`historial_precio\` (\`id\` int NOT NULL AUTO_INCREMENT, \`precioAnterior\` decimal(15,5) NOT NULL DEFAULT '0.00000', \`precioNuevo\` decimal(15,5) NOT NULL DEFAULT '0.00000', \`fecha\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`motivo\` text NOT NULL, \`lote_id\` varchar(36) NULL, \`tipoAjuste\` enum ('PORCENTAJE', 'MONTO_FIJO') NULL, \`valorAplicado\` decimal(15,5) NULL, \`usuario_created_id\` int NULL, \`producto_id\` int NOT NULL, INDEX \`IDX_e2f1eed194c44ae80d797cb6d1\` (\`producto_id\`), INDEX \`IDX_546d861ccfb21e36b02b0e92c0\` (\`lote_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`producto\` DROP COLUMN \`codigoProveedor\``);
        await queryRunner.query(`ALTER TABLE \`producto\` DROP COLUMN \`codigoBarra\``);
        await queryRunner.query(`ALTER TABLE \`producto\` DROP COLUMN \`utilizaPack\``);
        await queryRunner.query(`ALTER TABLE \`producto\` DROP COLUMN \`cantidadPorPack\``);
        await queryRunner.query(`ALTER TABLE \`historial_precio\` ADD CONSTRAINT \`FK_e2f1eed194c44ae80d797cb6d1b\` FOREIGN KEY (\`producto_id\`) REFERENCES \`producto\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`historial_precio\` ADD CONSTRAINT \`FK_4fe0bf14e1262ee7ab26227519b\` FOREIGN KEY (\`usuario_created_id\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`historial_precio\` DROP FOREIGN KEY \`FK_4fe0bf14e1262ee7ab26227519b\``);
        await queryRunner.query(`ALTER TABLE \`historial_precio\` DROP FOREIGN KEY \`FK_e2f1eed194c44ae80d797cb6d1b\``);
        await queryRunner.query(`ALTER TABLE \`producto\` ADD \`cantidadPorPack\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`producto\` ADD \`utilizaPack\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`producto\` ADD \`codigoBarra\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`producto\` ADD \`codigoProveedor\` varchar(255) NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_546d861ccfb21e36b02b0e92c0\` ON \`historial_precio\``);
        await queryRunner.query(`DROP INDEX \`IDX_e2f1eed194c44ae80d797cb6d1\` ON \`historial_precio\``);
        await queryRunner.query(`DROP TABLE \`historial_precio\``);
        await queryRunner.query(`CREATE INDEX \`IDX_3a128605de9529f2d6a916f8f3\` ON \`producto\` (\`codigoProveedor\`)`);
    }

}
