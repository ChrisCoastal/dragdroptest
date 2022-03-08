import { ProjectInput } from './components/projectinput';
import { ProjectList } from './components/projectlist';

// CLASSES

// render form
new ProjectInput();

// render active/finished project sections
new ProjectList('active');
new ProjectList('finished');
