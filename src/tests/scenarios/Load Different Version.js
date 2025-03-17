mock("injectScript", function (url, onSuccess, onFailure) {
  assertThat(url).isEqualTo("https://www.saola.ai/sdk/saola.1.2.3.js");
  onSuccess();
});
runCode({
  token: "b99f858f-1f67-4524-88a6-8395395b435a",
  version: "1.2.3"
});
assertApi("gtmOnSuccess").wasCalled();
