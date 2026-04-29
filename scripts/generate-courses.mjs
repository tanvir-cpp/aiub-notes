import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(process.cwd(), "..");
const sourcePath = path.join(root, "courselist.txt");
const outputPath = path.join(process.cwd(), "src", "data", "courses.ts");
const seedPath = path.join(process.cwd(), "supabase", "seed_courses.sql");

if (!fs.existsSync(sourcePath)) {
  throw new Error(`Could not find ${sourcePath}`);
}

const source = fs.readFileSync(sourcePath, "utf8");
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${source}\nthis.courses = courses; this.majorCourses = majorCourses;`, sandbox);

const coreCourses = sandbox.courses.map((course) => ({
  ...course,
  category: "core",
  major: null
}));

const majorCourses = sandbox.majorCourses.map((course) => ({
  semester: null,
  ...course,
  category: "major"
}));

const allCourses = [...coreCourses, ...majorCourses].map((course, index) => ({
  id: `${course.code.replace(/[^A-Z0-9]/gi, "-")}-${index + 1}`,
  semester: course.semester,
  code: course.code,
  title: course.title,
  prerequisite: course.prerequisite,
  credit: course.credit,
  category: course.category,
  major: course.major ?? null
}));

const ts = `import type { Course } from "../types";\n\nexport const courses: Course[] = ${JSON.stringify(allCourses, null, 2)};\n`;

const sqlRows = allCourses
  .map((course) => {
    const values = [
      course.id,
      course.code,
      course.title,
      course.semester,
      course.prerequisite,
      course.credit,
      course.category,
      course.major
    ]
      .map((value) => (value === null || value === undefined ? "null" : `'${String(value).replaceAll("'", "''")}'`))
      .join(", ");
    return `  (${values})`;
  })
  .join(",\n");

const seedSql = `insert into public.courses (id, code, title, semester, prerequisite, credit, category, major)\nvalues\n${sqlRows}\non conflict (id) do update set\n  code = excluded.code,\n  title = excluded.title,\n  semester = excluded.semester,\n  prerequisite = excluded.prerequisite,\n  credit = excluded.credit,\n  category = excluded.category,\n  major = excluded.major;\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.mkdirSync(path.dirname(seedPath), { recursive: true });
fs.writeFileSync(outputPath, ts);
fs.writeFileSync(seedPath, seedSql);

console.log(`Generated ${allCourses.length} courses from courselist.txt`);
