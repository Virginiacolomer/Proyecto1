import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPresentacionToProducto1789656990455 implements MigrationInterface {
    name = 'AddPresentacionToProducto1789656990455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`producto\` ADD \`presentacion\` varchar(50) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`producto\` DROP COLUMN \`presentacion\``);
    }

}
