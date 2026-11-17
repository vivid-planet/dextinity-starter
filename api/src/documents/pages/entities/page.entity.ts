import {
    type BlockDataInterface,
    DocumentInterface,
    PageTreeNodeDocumentEntityScopeService,
    RootBlock,
    RootBlockDataScalar,
    RootBlockEntity,
    RootBlockType,
    ScopedEntity,
} from "@dextinity/cms-api";
import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { BaseEntity, OptionalProps } from "@mikro-orm/postgresql";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { randomUUID } from "crypto";

import { PageContentBlock } from "../blocks/page-content.block.js";
import { SeoBlock } from "../blocks/seo.block.js";
import { StageBlock } from "../blocks/stage.block.js";

@Entity()
@ObjectType({
    implements: () => [DocumentInterface],
})
@RootBlockEntity()
@ScopedEntity(PageTreeNodeDocumentEntityScopeService)
export class Page extends BaseEntity implements DocumentInterface {
    [OptionalProps]?: "createdAt" | "updatedAt";

    @PrimaryKey({ type: "uuid" })
    @Field(() => ID)
    id: string = randomUUID();

    @RootBlock(PageContentBlock)
    @Property({ type: new RootBlockType(PageContentBlock) })
    @Field(() => RootBlockDataScalar(PageContentBlock))
    content: BlockDataInterface;

    @RootBlock(SeoBlock)
    @Property({ type: new RootBlockType(SeoBlock) })
    @Field(() => RootBlockDataScalar(SeoBlock))
    seo: BlockDataInterface;

    @RootBlock(StageBlock)
    @Property({ type: new RootBlockType(StageBlock) })
    @Field(() => RootBlockDataScalar(StageBlock))
    stage: BlockDataInterface;

    @Property({
        type: "timestamp with time zone",
    })
    @Field()
    createdAt: Date = new Date();

    @Property({
        type: "timestamp with time zone",
        onUpdate: () => new Date(),
    })
    @Field()
    updatedAt: Date = new Date();
}
