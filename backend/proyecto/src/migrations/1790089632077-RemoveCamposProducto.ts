import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCamposProducto1790089632077 implements MigrationInterface {
    name = 'RemoveCamposProducto1790089632077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3a128605de9529f2d6a916f8f3\` ON \`producto\``);
        await queryRunner.query(`ALTER TABLE \`producto\` DROP COLUMN \`codigoProveedor\``);
        await queryRunner.query(`ALTER TABLE \`producto\` DROP COLUMN \`codigoBarra\``);
        await queryRunner.query(`ALTER TABLE \`producto\` DROP COLUMN \`utilizaPack\``);
        await queryRunner.query(`ALTER TABLE \`producto\` DROP COLUMN \`cantidadPorPack\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`producto\` ADD \`cantidadPorPack\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`producto\` ADD \`utilizaPack\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`producto\` ADD \`codigoBarra\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`producto\` ADD \`codigoProveedor\` varchar(255) NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_3a128605de9529f2d6a916f8f3\` ON \`producto\` (\`codigoProveedor\`)`);
    }

}
