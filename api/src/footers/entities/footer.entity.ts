import {
    type BlockDataInterface,
    CrudSingleGenerator,
    DocumentInterface,
    RootBlock,
    RootBlockDataScalar,
    RootBlockEntity,
    RootBlockType,
} from "@dextinity/cms-api";
import { Embedded, Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { BaseEntity, OptionalProps } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { FooterContentBlock } from "@src/footers/blocks/footer-content.block.js";
import { FooterScope } from "@src/footers/dto/footer-scope.js";
import { randomUUID } from "crypto";

@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@RootBlockEntity()
@CrudSingleGenerator({ requiredPermission: "pageTree" })
export class Footer extends BaseEntity implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = randomUUID();

    @RootBlock(FooterContentBlock)
    @Property({ type: new RootBlockType(FooterContentBlock) })
    @Field(() => RootBlockDataScalar(FooterContentBlock))
    content: BlockDataInterface;

    @Embedded(() => FooterScope)
    @Field(() => FooterScope)
    scope: FooterScope;

    @Property({ type: "timestamp with time zone" })
    @Field()
    createdAt: Date = new Date();

    @Property({ type: "timestamp with time zone", onUpdate: () => new Date() })
    @Field()
    updatedAt: Date = new Date();
}
