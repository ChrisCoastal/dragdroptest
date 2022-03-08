// Component Base Class

export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
