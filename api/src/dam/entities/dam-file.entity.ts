import { createFileEntity } from "@dextinity/cms-api";

import { DamFolder } from "./dam-folder.entity";

const DamFile = createFileEntity({ Folder: DamFolder });

type DamFile = typeof DamFile;

export { DamFile };
