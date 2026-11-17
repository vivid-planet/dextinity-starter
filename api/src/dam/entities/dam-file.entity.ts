import { createFileEntity } from "@dextinity/cms-api";

import { DamFolder } from "./dam-folder.entity.js";

const DamFile = createFileEntity({ Folder: DamFolder });

type DamFile = typeof DamFile;

export { DamFile };
