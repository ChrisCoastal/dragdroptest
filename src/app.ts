//////////////////////////
// DOM Elements

console.log("works");

const projInputForm = document.getElementById(
  "project-input"
)! as HTMLTemplateElement;

const form = projInputForm.content.cloneNode(true);

const projectEl = document.getElementById("single-project");
const projectListEl = document.getElementById("project-list");

const appContainerEl = document.getElementById("app")! as HTMLDivElement;

const initProject = (arr: string[]) => {
  const project = new Project(...arr);
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

  constructor(t: string, d: string, p: number) {
    this.title = t;
    this.description = d;
    this.people = p;
  }
}
