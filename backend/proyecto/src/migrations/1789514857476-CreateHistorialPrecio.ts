import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHistorialPrecio1789514857476 implements MigrationInterface {
    name = 'CreateHistorialPrecio1789514857476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`historial_precio\` (\`id\` int NOT NULL AUTO_INCREMENT, \`producto_id\` int NOT NULL, \`lote_id\` varchar(36) NULL, \`precioAnterior\` decimal(15,5) NOT NULL DEFAULT '0.00000', \`precioNuevo\` decimal(15,5) NOT NULL DEFAULT '0.00000', \`tipoAjuste\` enum ('PORCENTAJE', 'MONTO_FIJO') NOT NULL, \`valorAplicado\` decimal(15,5) NOT NULL DEFAULT '0.00000', \`motivo\` text NOT NULL, \`usuario_created_id\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_historial_precio_producto_id\` (\`producto_id\`), INDEX \`IDX_historial_precio_lote_id\` (\`lote_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`historial_precio\` ADD CONSTRAINT \`FK_historial_precio_producto\` FOREIGN KEY (\`producto_id\`) REFERENCES \`producto\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`historial_precio\` ADD CONSTRAINT \`FK_historial_precio_usuario\` FOREIGN KEY (\`usuario_created_id\`) REFERENCES \`usuario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`historial_precio\` DROP FOREIGN KEY \`FK_historial_precio_usuario\``);
        await queryRunner.query(`ALTER TABLE \`historial_precio\` DROP FOREIGN KEY \`FK_historial_precio_producto\``);
        await queryRunner.query(`DROP INDEX \`IDX_historial_precio_lote_id\` ON \`historial_precio\``);
        await queryRunner.query(`DROP INDEX \`IDX_historial_precio_producto_id\` ON \`historial_precio\``);
        await queryRunner.query(`DROP TABLE \`historial_precio\``);
    }

}
