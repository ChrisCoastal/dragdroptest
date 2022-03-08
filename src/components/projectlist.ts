import { Component } from './basecomponent';
import { ProjectItem } from './projectitem';
import { Binder } from '../decorators/binderdecorator';
import { Droppable } from '../model/dragdropinterface';
import { projectState } from '../state/projectstate';
import { Project, ProjectStatus } from '../model/projectmodel';

// ProjectList Class
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements Droppable
{
  // templateEl: HTMLTemplateElement;
  // hostEl: HTMLDivElement;
  // element: HTMLElement;
  assignedProjects: Project[];

  constructor(private status: 'active' | 'finished') {
    super('project-list', 'app', false, `${status}-projects`);

    this.assignedProjects = [];

    // renders project lists
    this._configure();
    this._renderContent();
  }

  @Binder
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault(); // drop event will only be allowed if the drop element has preventDefault()
      const listEl = this.element.querySelector('ul')! as HTMLUListElement;
      listEl.classList.add('droppable');
    }
  }

  @Binder
  dropHandler(event: DragEvent) {
    const projId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      projId,
      this.status === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @Binder
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')! as HTMLUListElement;
    listEl.classList.remove('droppable');
  }

  _configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
    projectState.addListener((projects: Project[]) => {
      const filterProjectStatus = projects.filter((proj) => {
        proj.activeStatus === ProjectStatus.Active;
        if (this.status === 'active') {
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
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.status.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.status}-projects-list`
    )! as HTMLUListElement;

    // clear all current projects from list
    listEl.innerHTML = '';
    // rendering all the user createdprojects
    for (const projItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projItem);
    }
  }
}
