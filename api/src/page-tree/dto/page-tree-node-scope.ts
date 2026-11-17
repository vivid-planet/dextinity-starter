import { Embeddable, Property } from "@mikro-orm/decorators/legacy";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@Embeddable()
@ObjectType("PageTreeNodeScope") // name must not be changed in the app
@InputType("PageTreeNodeScopeInput") // name must not be changed in the app
export class PageTreeNodeScope {
    @Property({ type: "text" })
    @Field()
    @IsString()
    domain: string;

    @Property({ type: "text" })
    @Field()
    @IsString()
    language: string;
}
