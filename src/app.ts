import { ProjectInput } from "./components/projectinput.js";
import { ProjectList } from "./components/projectlist.js";

// CLASSES

// render form
new ProjectInput();

// render active/finished project sections
new ProjectList("active");
new ProjectList("finished");
