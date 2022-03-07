// Project Type

enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public people: number,
    public activeStatus: ProjectStatus
  ) {
    //
  }
}

// Drag and Drop Interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface Droppable {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = []; // subscriber

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }
  addProject(t: string, d: string, p: number) {
    const newProject = new Project(
      Math.random().toString(),
      t,
      d,
      p,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // slice creates a copy, so original isn't modified unintentionally
    }
  }

  static getInstance() {
    if (this.instance) return this.instance;
    this.instance = new ProjectState();
    return this.instance;
  }
}

// getInstance ensures always working with the same single object in memory (Singleton)
const projectState = ProjectState.getInstance();

// Decorators
function Binder(
  _target: Object,
  _methodName: Object,
  desc: PropertyDescriptor
) {
  const newPropDesc: PropertyDescriptor = {
    configurable: true,
    get() {
      const binding = desc.value.bind(this);
      return binding;
    },
  };
  return newPropDesc;
}

// Validation

interface Validation {
  value: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(formInput: Validation) {
  let isValid = true;
  if (formInput.required) {
    isValid = isValid && formInput.value.toString().trim().length !== 0;
  }
  if (formInput.minLength != null && typeof formInput.value === "string") {
    isValid = isValid && formInput.value.length >= formInput.minLength;
  }
  if (formInput.maxLength != null && typeof formInput.value === "string") {
    isValid = isValid && formInput.value.length <= formInput.maxLength;
  }
  if (formInput.min != null && typeof formInput.value === "number") {
    isValid = isValid && formInput.value >= formInput.min;
  }
  if (formInput.max != null && typeof formInput.value === "number") {
    isValid = isValid && formInput.value <= formInput.max;
  }
  //
  return isValid;
}

// CLASSES

// Component Base Class

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertBegin: boolean,
    newElementId?: string
  ) {
    this.templateEl = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) this.element.id = newElementId;

    this.attach(insertBegin);
  }

  private attach(insert: boolean) {
    this.hostEl.insertAdjacentElement(
      insert ? "afterbegin" : "beforeend",
      this.element
    );
  }
  abstract _configure(): void;
  abstract _renderContent(): void;
}

// ProjectItem Class
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get numPeople() {
    if (this.project.people === 1) return "1 person has";
    return `${this.project.people} people have`;
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this._configure();
    this._renderContent();
  }

  @Binder
  dragStartHandler(event: DragEvent) {
    console.log(event);
  }
  @Binder
  dragEndHandler(_: DragEvent) {
    console.log("Dragend");
  }

  _configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragstart", this.dragEndHandler);
  }

  _renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent =
      this.numPeople + " been assigned.";
    this.element.querySelector("p")!.textContent = this.project.desc;
  }
}

// ProjectList Class
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements Droppable
{
  // templateEl: HTMLTemplateElement;
  // hostEl: HTMLDivElement;
  // element: HTMLElement;
  assignedProjects: Project[];

  constructor(private status: "active" | "finished") {
    super("project-list", "app", false, `${status}-projects`);

    this.assignedProjects = [];

    // renders project lists
    this._configure();
    this._renderContent();
  }

  @Binder
  dragOverHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")! as HTMLUListElement;
    listEl.classList.add("droppable");
  }
  dropHandler(_: DragEvent) {
    //
  }
  @Binder
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")! as HTMLUListElement;
    listEl.classList.remove("droppable");
  }

  _configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);
    projectState.addListener((projects: Project[]) => {
      const filterProjectStatus = projects.filter((proj) => {
        proj.activeStatus === ProjectStatus.Active;
        if (this.status === "active") {
          return proj.activeStatus === ProjectStatus.Active;
        }
        return proj.activeStatus === ProjectStatus.Finished;
      });
      this.assignedProjects = filterProjectStatus;
      this.renderProjects();
    });
  }

  _renderContent() {
    const listId = `${this.status}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.status.toUpperCase() + " PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.status}-projects-list`
    )! as HTMLUListElement;

    // clear all current projects from list
    listEl.innerHTML = "";
    // rendering all the user createdprojects
    for (const projItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projItem);
    }
  }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputEl = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descInputEl = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this._configure();
  }

  _renderContent(): void {}

  _configure() {
    // this.element.addEventListener("submit", this.submitHandler.bind(this));
    this.element.addEventListener("submit", this.submitHandler); // with decorator
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDesc = this.descInputEl.value;
    const enteredPeople = this.peopleInputEl.value;

    const titleValidation: Validation = {
      value: enteredTitle,
      required: true,
      minLength: 2,
      maxLength: 30,
    };

    const descValidation: Validation = {
      value: enteredDesc,
      required: true,
      minLength: 6,
      maxLength: 100,
    };

    const peopleValidation: Validation = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 10,
    };

    if (
      !validate(titleValidation) ||
      !validate(descValidation) ||
      !validate(peopleValidation)
    ) {
      alert("Invalid input please try again");
      return;
    }
    return [enteredTitle, enteredDesc, +enteredPeople];
  }

  private clearInputs() {
    this.titleInputEl.value = "";
    this.descInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  @Binder // note that the decorator goes here
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      // console.log(title, desc, people);
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}

// render form
const projInput = new ProjectInput();

// render active/finished project sections
const activeProjList = new ProjectList("active");
const finishedProjList = new ProjectList("finished");
