import { EntityName } from 'src/common/enums/entity.enum';
import { Roles } from 'src/common/enums/role.enum';
import { UserStatus } from 'src/modules/user/enum/status.enum';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class $npmConfigName1723030946981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EntityName.User,
        columns: [
          { name: 'id', isPrimary: true, type: 'serial', isNullable: false },
          { name: 'username', type: 'character varying(50)', isNullable: true, isUnique: true },
          { name: 'phone', type: 'character varying(12)', isNullable: true, isUnique: true },
          { name: 'email', type: 'character varying(100)', isNullable: true, isUnique: true },
          { name: 'role', type: 'enum', enum: [Roles.Admin, Roles.User], default: `'${Roles.User}'` },
          { name: 'status', type: 'enum', enum: [UserStatus.Block, UserStatus.Report], isNullable: true },
          { name: 'new_email', type: 'varchar', isNullable: true },
          { name: 'profileId', type: 'int', isUnique: true, isNullable: true },
          { name: 'new_phone', type: 'varchar', isNullable: true },
          { name: 'verify_phone', type: 'boolean', isNullable: true, default: false },
          { name: 'verify_email', type: 'boolean', isNullable: true, default: false },
          { name: 'password', type: 'varchar(20)', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: EntityName.Profile,
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'nick_name', type: 'varchar(50)', isNullable: true },
          { name: 'bio', type: 'varchar', isNullable: true },
          { name: 'image_profile', type: 'varchar', isNullable: true },
          { name: 'userId', type: 'int', isNullable: false, isUnique: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: EntityName.Blog,
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'title', type: 'varchar(150)', isNullable: false },
          { name: 'content', type: 'text', isNullable: false },
          { name: 'userId', isNullable: false, type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      EntityName.Profile,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: EntityName.User,
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      EntityName.User,
      new TableForeignKey({
        columnNames: ['profileId'],
        referencedColumnNames: ['id'],
        referencedTableName: EntityName.Profile,
      }),
    );

    await queryRunner.createForeignKey(
      EntityName.Blog,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: EntityName.User,
        onDelete: 'CASCADE',
      }),
    );

    // const balance = await queryRunner.hasColumn(EntityName.User, 'balance');

    // if (!balance) {
    //   //@ts-ignore
    //   await queryRunner.addColumn(EntityName.User, { name: 'balance', type: 'numeric', default: 0, isNullable: true });
    // }

    // const username = await queryRunner.hasColumn(EntityName.User, 'username');
    // if (username) {
    //   //@ts-ignore
    //   await queryRunner.changeColumn(
    //     EntityName.User,
    //     'username',
    //     new TableColumn({
    //       name: 'username',
    //       isNullable: false,
    //       isUnique: true,
    //       type: 'varchar(50)',
    //     }),
    //   );
    // }

    // await queryRunner.query(`
    //   ALTER TABLE "user" RENATE COLUMN "phone" TO "mobile"
    // `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // const userTable = await queryRunner.hasTable(EntityName.User);
    // if (userTable) await queryRunner.dropTable(EntityName.User);

    // await queryRunner.dropColumn(EntityName.User, 'balance');

    // or
    const profile = await queryRunner.getTable(EntityName.Profile);
    if (profile) {
      const userFk = profile.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
      if (userFk) await queryRunner.dropForeignKey(EntityName.Profile, userFk);
    }

    const user = await queryRunner.getTable(EntityName.User);
    if (user) {
      const profileFk = user.foreignKeys.find((fk) => fk.columnNames.indexOf('profileId') !== -1);
      if (profileFk) await queryRunner.dropForeignKey(EntityName.User, profileFk);
    }

    const blog = await queryRunner.getTable(EntityName.Blog);
    if (blog) {
      const userBlogFk = blog.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
      if (userBlogFk) await queryRunner.dropForeignKey(EntityName.Blog, userBlogFk);
    }

    // const blog = await queryRunner.getTable(EntityName.Blog);
    // if (blog) {
    //   const userBlogFk = blog.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
    //   if (userBlogFk) await queryRunner.dropForeignKey(EntityName.Blog, userBlogFk);
    // }

    await queryRunner.dropTable(EntityName.Blog, true);
    await queryRunner.dropTable(EntityName.Profile, true);
    await queryRunner.dropTable(EntityName.User, true);
  }
}
