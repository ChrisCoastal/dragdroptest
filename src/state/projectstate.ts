import { Project, ProjectStatus } from '../model/projectmodel';

// State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = []; // subscriber

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
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
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const projectToMove = this.projects.find((proj) => proj.id === projectId);
    if (projectToMove && projectToMove.activeStatus !== newStatus) {
      projectToMove.activeStatus = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
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
export const projectState = ProjectState.getInstance();
