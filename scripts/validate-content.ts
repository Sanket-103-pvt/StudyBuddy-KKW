import fs from "fs";
import path from "path";
import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

const SCHEMA_PATH = path.join(process.cwd(), "content-schema.json");
const CONTENT_DIR = path.join(process.cwd(), "content");

// Schema for content/index.json
const indexItemSchema = {
  type: "object",
  required: ["id", "name", "icon", "unitCount", "lastUpdated"],
  additionalProperties: false,
  properties: {
    id: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    icon: { type: "string", minLength: 1 },
    unitCount: { type: "integer", minimum: 0 },
    lastUpdated: { type: "string", pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
  },
};

const indexSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    "first-year": { type: "array", items: indexItemSchema },
    "second-year": { type: "array", items: indexItemSchema },
    "third-year": { type: "array", items: indexItemSchema },
    "fourth-year": { type: "array", items: indexItemSchema },
  },
};

function getLineNumber(fileContent: string, error: ErrorObject): number {
  if (!error.instancePath || error.instancePath === "") {
    return 1;
  }

  const parts = error.instancePath.split("/").filter(Boolean);
  if (parts.length === 0) return 1;

  const lastToken = parts[parts.length - 1];
  const targetKey = isNaN(Number(lastToken)) ? lastToken : parts[parts.length - 2];

  if (!targetKey) return 1;

  const lines = fileContent.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`"${targetKey}"`)) {
      return i + 1;
    }
  }

  return 1;
}

function formatErrorMessage(error: ErrorObject): string {
  const pathStr = error.instancePath ? `at '${error.instancePath}' ` : "";
  if (error.keyword === "required" && error.params && "missingProperty" in error.params) {
    return `Missing required property '${error.params.missingProperty}'`;
  }
  if (error.keyword === "enum" && error.params && "allowedValues" in error.params) {
    return `${pathStr}value must be one of [${(error.params.allowedValues as string[]).map((v) => `"${v}"`).join(", ")}]`;
  }
  if (error.keyword === "pattern") {
    return `${pathStr}value does not match required format/pattern (${error.params.pattern})`;
  }
  if (error.keyword === "additionalProperties" && error.params && "additionalProperty" in error.params) {
    return `Unexpected property '${error.params.additionalProperty}' is not allowed in schema`;
  }
  return `${pathStr}${error.message || "Invalid value"}`;
}

function getAllJsonFiles(dir: string): string[] {
  let files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push(fullPath);
    }
  }

  return files;
}

function validateAllContent(): boolean {
  console.log("🔍 Validating JSON content files against AJV Schema...\n");

  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error(`❌ Schema file missing: ${SCHEMA_PATH}`);
    return false;
  }

  let rawSchema: object;
  try {
    rawSchema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf-8"));
  } catch (err) {
    console.error(`❌ Failed to parse ${SCHEMA_PATH}:`, err);
    return false;
  }

  const validateSubject = ajv.compile(rawSchema);
  const validateIndex = ajv.compile(indexSchema);

  const jsonFiles = getAllJsonFiles(CONTENT_DIR);
  let totalFiles = 0;
  let errorCount = 0;

  for (const filePath of jsonFiles) {
    totalFiles++;
    const relativePath = path.relative(process.cwd(), filePath);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    let parsed: unknown;
    try {
      parsed = JSON.parse(fileContent);
    } catch (err) {
      errorCount++;
      console.error(`❌ [SYNTAX ERROR] ${relativePath}`);
      console.error(`   Line 1: Invalid JSON syntax (${(err as Error).message})\n`);
      continue;
    }

    const isIndex = path.basename(filePath) === "index.json";
    const validator = isIndex ? validateIndex : validateSubject;
    const isValid = validator(parsed);

    if (!isValid && validator.errors) {
      errorCount++;
      console.error(`❌ [SCHEMA VIOLATION] ${relativePath}`);
      for (const err of validator.errors) {
        const line = getLineNumber(fileContent, err);
        const msg = formatErrorMessage(err);
        console.error(`   • Line ${line}: ${msg}`);
      }
      console.error("");
    } else {
      console.log(`✓ [VALID] ${relativePath}`);
    }
  }

  console.log("\n--------------------------------------------------");
  if (errorCount > 0) {
    console.error(`💥 Validation failed! Found errors in ${errorCount} of ${totalFiles} JSON files.`);
    return false;
  } else {
    console.log(`✨ Success! All ${totalFiles} JSON content files passed schema validation.`);
    return true;
  }
}

const success = validateAllContent();
if (!success) {
  process.exit(1);
}
