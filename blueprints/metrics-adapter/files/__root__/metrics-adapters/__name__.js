<%= importStatement %>

export default class <%= classifiedModuleName %> extends <%= baseClass %> {
  toStringExtension() {
    <%= toStringExtension %>
  }

  // eslint-disable-next-line ember/classic-decorator-hooks
  init() {}

  identify() {}

  trackEvent() {}

  trackPage() {}

  alias() {}

  willDestroy() {}
}
