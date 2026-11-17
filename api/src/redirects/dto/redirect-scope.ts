import { Embeddable, Property } from "@mikro-orm/decorators/legacy";
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@Embeddable()
@ObjectType("RedirectScope") // name must not be changed in the app
@InputType("RedirectScopeInput") // name must not be changed in the app
export class RedirectScope {
    @Property({ type: "text" })
    @Field()
    @IsString()
    domain: string;
}
