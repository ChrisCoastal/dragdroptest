/// <reference path="./model/dragdropinterface.ts" />
/// <reference path="./model/projectmodel.ts" />
/// <reference path="./state/projectstate.ts" />
/// <reference path="./util/validation.ts" />
/// <reference path="./decorators/binderdecorator.ts" />
/// <reference path="./components/projectinput.ts" />
/// <reference path="./components/projectlist.ts" />

namespace App {
  // CLASSES

  // render form
  new ProjectInput();

  // render active/finished project sections
  new ProjectList("active");
  new ProjectList("finished");
}
