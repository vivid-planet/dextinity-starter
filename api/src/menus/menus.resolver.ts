import { PageTreeNodeInterface, PageTreeReadApiService, RequiredPermission } from "@dextinity/cms-api";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNode } from "@src/page-tree/entities/page-tree-node.entity";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";

@Resolver()
@RequiredPermission(["pageTree"])
export class MenusResolver {
    constructor(private readonly pageTreeReadApi: PageTreeReadApiService) {}

    @Query(() => [PageTreeNode])
    async mainMenu(@Args("scope", { type: () => PageTreeNodeScope }) scope: PageTreeNodeScope): Promise<PageTreeNodeInterface[]> {
        // Preload all page-tree nodes for the given scope in a single query to avoid N+1 queries
        await this.pageTreeReadApi.preloadNodes(scope);
        return this.pageTreeReadApi.pageTreeRootNodeList({ scope, category: PageTreeNodeCategory.mainNavigation, excludeHiddenInMenu: true });
    }
}
