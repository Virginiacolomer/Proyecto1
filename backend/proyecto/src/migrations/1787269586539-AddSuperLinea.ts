import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSuperLinea1787269586539 implements MigrationInterface {
    name = 'AddSuperLinea1787269586539'

    public async up(queryRunner: QueryRunner): Promise<void> {
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

        // Insertar SuperLínea por defecto "GENERAL" si la tabla está vacía
        await queryRunner.query(`
            INSERT INTO \`super_linea\` (\`id\`, \`denominacion\`, \`observacion\`, \`sistema\`)
            SELECT 1, 'GENERAL', 'SuperLínea por defecto', 1
            WHERE NOT EXISTS (SELECT 1 FROM \`super_linea\` WHERE \`id\` = 1);
        `);

        // Agregar columna super_linea_id a linea si no existe
        const hasColumn = await queryRunner.hasColumn('linea', 'super_linea_id');
        if (!hasColumn) {
            await queryRunner.query(`
                ALTER TABLE \`linea\` ADD COLUMN \`super_linea_id\` int NOT NULL DEFAULT 1
            `);
        }

        // Limpiar cualquier valor nulo, cero o huérfano antes de crear la relación de clave foránea
        await queryRunner.query(`
            UPDATE \`linea\` 
            SET \`super_linea_id\` = 1 
            WHERE \`super_linea_id\` IS NULL 
               OR \`super_linea_id\` = 0 
               OR \`super_linea_id\` NOT IN (SELECT \`id\` FROM \`super_linea\`);
        `);

        // Agregar Foreign Key si no existe
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
        await queryRunner.query(`ALTER TABLE \`linea\` DROP FOREIGN KEY \`FK_linea_super_linea\``).catch(() => {});
        await queryRunner.query(`ALTER TABLE \`linea\` DROP COLUMN \`super_linea_id\``).catch(() => {});
        await queryRunner.query(`DROP TABLE \`super_linea\``).catch(() => {});
    }
}
