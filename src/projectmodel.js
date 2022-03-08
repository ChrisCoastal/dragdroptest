"use strict";
var App;
(function (App) {
    // Project Type
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(id, title, desc, people, activeStatus) {
            this.id = id;
            this.title = title;
            this.desc = desc;
            this.people = people;
            this.activeStatus = activeStatus;
            //
        }
    }
    App.Project = Project;
})(App || (App = {}));
