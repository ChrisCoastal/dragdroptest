import { Component } from './basecomponent';
import { validate, Validation } from '../util/validation';
import { Binder } from '../decorators/binderdecorator';
import { projectState } from '../state/projectstate';

// ProjectInput Class
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputEl = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descInputEl = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    this._configure();
  }

  _renderContent(): void {}

  _configure() {
    // this.element.addEventListener("submit", this.submitHandler.bind(this));
    this.element.addEventListener('submit', this.submitHandler); // with decorator
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
      alert('Invalid input please try again');
      return;
    }
    return [enteredTitle, enteredDesc, +enteredPeople];
  }

  private clearInputs() {
    this.titleInputEl.value = '';
    this.descInputEl.value = '';
    this.peopleInputEl.value = '';
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
