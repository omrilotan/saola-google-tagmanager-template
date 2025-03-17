runCode();
assertApi("setInWindow").wasNotCalled();
assertApi("injectScript").wasNotCalled();
assertApi("gtmOnSuccess").wasNotCalled();
assertApi("gtmOnFailure").wasCalled();
