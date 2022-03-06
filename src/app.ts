////////////////////////////////////////////////////
// DOM ELEMENTS

////////////////////////////////////////////////////
// MODEL

const validateFormData = (data: string[]): boolean => {
  //
};

const formData = (data: string[]) => {
  validateFormData(data);
  // return valid / not valid to controller
  // if valid, store data (project class?)
};

////////////////////////////////////////////////////
// CONTROLLER

// initialize the form from template
const initForm = () => {
  // call on view to render form
};

// handle form submission
const submitHandler = (event: Event): string[] => {
  // pass form data to model
  // recieve form data validation from model and update view
  // call Controller view proj update accordingly from validation
};

////////////////////////////////////////////////////
// VIEW

// render form
const renderForm = () => {
  // render form to UI
  // add eventListener to submit (pass to Controller handler)
};

// render single project list item from template
const renderProject = (projItem: any) => {
  // create project list item from template
  // create ul from template
  // add li to ul and append to app div
};

////////////////////////////////////////////////////////////
console.log("works");

const projInputForm = document.getElementById(
  "project-input"
)! as HTMLTemplateElement;

const singleProj = document.getElementById(
  "single-project"
)! as HTMLTemplateElement;

const projList = document.getElementById(
  "project-list"
)! as HTMLTemplateElement;

const form = projInputForm.content.cloneNode(true);

const projectEl = document.getElementById("single-project");
const projectListEl = document.getElementById("project-list");

const appContainerEl = document.getElementById("app")! as HTMLDivElement;

const initProject = (arr: string[]) => {
  const project = new Project(...arr);
  console.log(project);
};

const initForm = (form: any) => {
  appContainerEl.appendChild(form);

  const newFormEl = document.querySelector("form")! as HTMLFormElement;
  console.log(newFormEl);

  const formData: string[] = [];
  // submitButtonEl.addEventListener("submit", submitHandler);
  newFormEl.addEventListener("submit", function (e: Event) {
    e.preventDefault();
    for (let i = 0; i < newFormEl.length - 1; i++) {
      console.log((newFormEl.elements[i] as HTMLInputElement).value);
      const input: string = (newFormEl.elements[i] as HTMLInputElement).value;
      formData.push(input);
      // newFormEl.elements[i].textContent = "";
    }
    console.log(formData);

    initProject(formData);
    // const formData = [...new FormData(this)];
    // console.log(formData.entries());
    // const data = Object.fromEntries(formData);
    // console.log(data);
  });
};

initForm(form);

// const submitButtonEl = document.querySelector("button")! as HTMLButtonElement;
// console.log(submitButtonEl);

// // submitButtonEl.addEventListener("submit", submitHandler);
// submitButtonEl.addEventListener("submit", (e) => {
//   e.preventDefault();
//   console.log(e);
// });

const submitHandler = (submitEvent: Event) => {
  submitEvent.preventDefault();
  console.log("clicked");

  console.log(submitEvent);
};

// function appendProj(projObj: object) {}

if ("content" in document.createElement("template")) {
  const formInputEls = document.querySelectorAll(".form-control");
  // const formInputEls = document.getElementsByClassName("form-control");
  console.log(formInputEls);
}

class Project {
  title: string;
  description: string;
  people: number;

  constructor(...args) {
    this.title = args[0];
    this.description = args[1];
    this.people = args[2];
  }
}
