import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1605937226883 implements MigrationInterface {
    name = 'CreateUsersTable1605937226883';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(255) NOT NULL, `firstName` varchar(50) NOT NULL, `lastName` varchar(50) NOT NULL, `dateOfBirth` date NOT NULL, `gender` enum ('male', 'female') NOT NULL, `pushNotificationToken` varchar(255) NULL, `createdOn` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedOn` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_951b8f1dfc94ac1d0301a14b7e` (`uuid`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'DROP INDEX `IDX_951b8f1dfc94ac1d0301a14b7e` ON `users`'
        );
        await queryRunner.query('DROP TABLE `users`');
    }
}
