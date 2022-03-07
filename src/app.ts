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

// State Management
type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = []; // subscriber
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    //
  }
  addProject(t: string, d: string, p: number) {
    const newProject = new Project(
      Math.random.toString(),
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

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
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

// ProjectList Class
class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: Project[];

  constructor(private status: "active" | "finished") {
    this.templateEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;
    this.assignedProjects = [];

    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.status}-projects`;

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

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.status}-projects-list`
    )! as HTMLUListElement;

    // rendering all the user createdprojects
    for (const projItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = projItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.status}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.status.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostEl.insertAdjacentElement("beforeend", this.element);
  }
}

// ProjectInput Class
class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleInputEl: HTMLInputElement;
  descInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputEl = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descInputEl = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
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

  private configure() {
    // this.element.addEventListener("submit", this.submitHandler.bind(this));
    this.element.addEventListener("submit", this.submitHandler); // with decorator
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element);
  }
}

// render form
const projInput = new ProjectInput();

// render active/finished project sections
const activeProjList = new ProjectList("active");
const finishedProjList = new ProjectList("finished");
