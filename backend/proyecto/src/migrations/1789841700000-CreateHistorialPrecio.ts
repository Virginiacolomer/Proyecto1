import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHistorialPrecio1789841700000 implements MigrationInterface {
    name = 'CreateHistorialPrecio1789841700000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`historial_precio\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`precioAnterior\` decimal(15,5) NOT NULL DEFAULT '0.00000',
            \`precioNuevo\` decimal(15,5) NOT NULL DEFAULT '0.00000',
            \`fecha\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
            \`motivo\` text NOT NULL,
            \`producto_id\` int NOT NULL,
            INDEX \`IDX_historial_precio_producto_id\` (\`producto_id\`),
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`historial_precio\` ADD CONSTRAINT \`FK_historial_precio_producto_id\` FOREIGN KEY (\`producto_id\`) REFERENCES \`producto\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`historial_precio\` DROP FOREIGN KEY \`FK_historial_precio_producto_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_historial_precio_producto_id\` ON \`historial_precio\``);
        await queryRunner.query(`DROP TABLE \`historial_precio\``);
    }
}
