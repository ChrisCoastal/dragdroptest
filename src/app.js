"use strict";
/// <reference path="dragdropinterface.ts" />
/// <reference path="projectmodel.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    class State {
        constructor() {
            this.listeners = []; // subscriber
        }
        addListener(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        addProject(t, d, p) {
            const newProject = new App.Project(Math.random().toString(), t, d, p, App.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        moveProject(projectId, newStatus) {
            const projectToMove = this.projects.find((proj) => proj.id === projectId);
            if (projectToMove && projectToMove.activeStatus !== newStatus) {
                projectToMove.activeStatus = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice()); // slice creates a copy, so original isn't modified unintentionally
            }
        }
        static getInstance() {
            if (this.instance)
                return this.instance;
            this.instance = new ProjectState();
            return this.instance;
        }
    }
    // getInstance ensures always working with the same single object in memory (Singleton)
    const projectState = ProjectState.getInstance();
    // Decorators
    function Binder(_target, _methodName, desc) {
        const newPropDesc = {
            configurable: true,
            get() {
                const binding = desc.value.bind(this);
                return binding;
            },
        };
        return newPropDesc;
    }
    function validate(formInput) {
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
    class Component {
        constructor(templateId, hostElementId, insertBegin, newElementId) {
            this.templateEl = document.getElementById(templateId);
            this.hostEl = document.getElementById(hostElementId);
            const importedNode = document.importNode(this.templateEl.content, true);
            this.element = importedNode.firstElementChild;
            if (newElementId)
                this.element.id = newElementId;
            this.attach(insertBegin);
        }
        attach(insert) {
            this.hostEl.insertAdjacentElement(insert ? "afterbegin" : "beforeend", this.element);
        }
    }
    // ProjectItem Class
    class ProjectItem extends Component {
        constructor(hostId, project) {
            super("single-project", hostId, false, project.id);
            this.project = project;
            this._configure();
            this._renderContent();
        }
        get numPeople() {
            if (this.project.people === 1)
                return "1 person has";
            return `${this.project.people} people have`;
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        }
        dragEndHandler(_) {
            console.log("Dragend");
        }
        _configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragstart", this.dragEndHandler);
        }
        _renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent =
                this.numPeople + " been assigned.";
            this.element.querySelector("p").textContent = this.project.desc;
        }
    }
    __decorate([
        Binder
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        Binder
    ], ProjectItem.prototype, "dragEndHandler", null);
    // ProjectList Class
    class ProjectList extends Component {
        constructor(status) {
            super("project-list", "app", false, `${status}-projects`);
            this.status = status;
            this.assignedProjects = [];
            // renders project lists
            this._configure();
            this._renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
                event.preventDefault(); // drop event will only be allowed if the drop element has preventDefault()
                const listEl = this.element.querySelector("ul");
                listEl.classList.add("droppable");
            }
        }
        dropHandler(event) {
            const projId = event.dataTransfer.getData("text/plain");
            projectState.moveProject(projId, this.status === "active" ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const listEl = this.element.querySelector("ul");
            listEl.classList.remove("droppable");
        }
        _configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
            projectState.addListener((projects) => {
                const filterProjectStatus = projects.filter((proj) => {
                    proj.activeStatus === App.ProjectStatus.Active;
                    if (this.status === "active") {
                        return proj.activeStatus === App.ProjectStatus.Active;
                    }
                    return proj.activeStatus === App.ProjectStatus.Finished;
                });
                this.assignedProjects = filterProjectStatus;
                this.renderProjects();
            });
        }
        _renderContent() {
            const listId = `${this.status}-projects-list`;
            this.element.querySelector("ul").id = listId;
            this.element.querySelector("h2").textContent =
                this.status.toUpperCase() + " PROJECTS";
        }
        renderProjects() {
            const listEl = document.getElementById(`${this.status}-projects-list`);
            // clear all current projects from list
            listEl.innerHTML = "";
            // rendering all the user createdprojects
            for (const projItem of this.assignedProjects) {
                new ProjectItem(this.element.querySelector("ul").id, projItem);
            }
        }
    }
    __decorate([
        Binder
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        Binder
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        Binder
    ], ProjectList.prototype, "dragLeaveHandler", null);
    // ProjectInput Class
    class ProjectInput extends Component {
        constructor() {
            super("project-input", "app", true, "user-input");
            this.titleInputEl = this.element.querySelector("#title");
            this.descInputEl = this.element.querySelector("#description");
            this.peopleInputEl = this.element.querySelector("#people");
            this._configure();
        }
        _renderContent() { }
        _configure() {
            // this.element.addEventListener("submit", this.submitHandler.bind(this));
            this.element.addEventListener("submit", this.submitHandler); // with decorator
        }
        gatherUserInput() {
            const enteredTitle = this.titleInputEl.value;
            const enteredDesc = this.descInputEl.value;
            const enteredPeople = this.peopleInputEl.value;
            const titleValidation = {
                value: enteredTitle,
                required: true,
                minLength: 2,
                maxLength: 30,
            };
            const descValidation = {
                value: enteredDesc,
                required: true,
                minLength: 6,
                maxLength: 100,
            };
            const peopleValidation = {
                value: +enteredPeople,
                required: true,
                min: 1,
                max: 10,
            };
            if (!validate(titleValidation) ||
                !validate(descValidation) ||
                !validate(peopleValidation)) {
                alert("Invalid input please try again");
                return;
            }
            return [enteredTitle, enteredDesc, +enteredPeople];
        }
        clearInputs() {
            this.titleInputEl.value = "";
            this.descInputEl.value = "";
            this.peopleInputEl.value = "";
        }
        submitHandler(event) {
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
    __decorate([
        Binder // note that the decorator goes here
    ], ProjectInput.prototype, "submitHandler", null);
    // render form
    new ProjectInput();
    // render active/finished project sections
    new ProjectList("active");
    new ProjectList("finished");
})(App || (App = {}));
