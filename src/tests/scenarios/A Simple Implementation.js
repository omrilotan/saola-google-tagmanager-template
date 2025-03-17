mock("injectScript", function (url, onSuccess, onFailure) {
  assertThat(url).isEqualTo("https://www.saola.ai/sdk/saola.latest.js");
  onSuccess();
});
runCode({
  token: "b99f858f-1f67-4524-88a6-8395395b435a"
});
assertApi("setInWindow").wasCalledWith(
  "SaolaParams",
  { token: "b99f858f-1f67-4524-88a6-8395395b435a" },
  true
);
assertApi("gtmOnSuccess").wasCalled();
