mock("injectScript", function (url, onSuccess, onFailure) {
  assertThat(url).isEqualTo(
    "https://www.saola.ai/sdk/saola.%3Fsome-query%3Dvalue%23.js"
  );
  onSuccess();
});
runCode({
  token: "b99f858f-1f67-4524-88a6-8395395b435a",
  version: "?some-query=value#"
});
assertApi("gtmOnSuccess").wasCalled();
