import { ProjectInput } from "../src/components/projectinput.js";
import { ProjectList } from "../src/components/projectlist.js";

// CLASSES

// render form
new ProjectInput();

// render active/finished project sections
new ProjectList("active");
new ProjectList("finished");
