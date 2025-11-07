import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFinanceTables1762539379789 implements MigrationInterface {
    name = 'CreateFinanceTables1762539379789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "sale_id" uuid NOT NULL, "product_id" uuid NOT NULL, "quantity" integer NOT NULL, "unit_price" numeric(15,2) NOT NULL, "total_price" numeric(15,2) NOT NULL, CONSTRAINT "PK_5a7dc5b4562a9e590528b3e08ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" uuid NOT NULL, "customer_id" uuid, "total_amount" numeric(15,2) NOT NULL, "subtotal" numeric(15,2), "tax_amount" numeric(15,2), "payment_method_id" uuid, "sale_date" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying(20) NOT NULL DEFAULT 'completed', CONSTRAINT "REL_000ae4a84cb4f52cb1bd99e033" UNIQUE ("transaction_id"), CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rentals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" uuid NOT NULL, "customer_id" uuid, "product_id" uuid NOT NULL, "rental_start" TIMESTAMP NOT NULL, "rental_end" TIMESTAMP NOT NULL, "total_amount" numeric(15,2) NOT NULL, "deposit_amount" numeric(15,2) NOT NULL DEFAULT '0', "status" character varying(20) NOT NULL DEFAULT 'active', CONSTRAINT "REL_9dc021b38d846c4b104c775265" UNIQUE ("transaction_id"), CONSTRAINT "PK_2b10d04c95a8bfe85b506ba52ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying(20) NOT NULL, "amount" numeric(15,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'MXN', "description" text, "transaction_date" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying(20) NOT NULL DEFAULT 'completed', "business_type" character varying(50), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sale_items" ADD CONSTRAINT "FK_c210a330b80232c29c2ad68462a" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_000ae4a84cb4f52cb1bd99e033e" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_b53046ece141355db11e7750c11" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rentals" ADD CONSTRAINT "FK_9dc021b38d846c4b104c775265e" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rentals" DROP CONSTRAINT "FK_9dc021b38d846c4b104c775265e"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_b53046ece141355db11e7750c11"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_000ae4a84cb4f52cb1bd99e033e"`);
        await queryRunner.query(`ALTER TABLE "sale_items" DROP CONSTRAINT "FK_c210a330b80232c29c2ad68462a"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "rentals"`);
        await queryRunner.query(`DROP TABLE "sales"`);
        await queryRunner.query(`DROP TABLE "sale_items"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
    }

}
