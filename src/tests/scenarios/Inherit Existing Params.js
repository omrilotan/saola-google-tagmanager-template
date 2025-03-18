const setInWindow = require("setInWindow");
setInWindow("SaolaParams", { pagename: "Home" }, true);
runCode({
  token: "b99f858f-1f67-4524-88a6-8395395b435a"
});
assertApi("setInWindow").wasCalledWith(
  "SaolaParams",
  {
    pagename: "Home",
    token: "b99f858f-1f67-4524-88a6-8395395b435a"
  },
  true
);
