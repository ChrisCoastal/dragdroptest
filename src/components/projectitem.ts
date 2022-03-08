import { Component } from "./basecomponent.js";
import { Binder } from "../decorators/binderdecorator.js";
import { Draggable } from "../model/dragdropinterface.js";
import { Project } from "../model/projectmodel.js";

// ProjectItem Class
export class ProjectItem
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
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
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
