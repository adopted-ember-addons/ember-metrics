<%= importStatement %>

export default class <%= classifiedModuleName %> extends <%= baseClass %> {
  toStringExtension() {
    <%= toStringExtension %>
  }

  init() {}

  identify() {}

  trackEvent() {}

  trackPage() {}

  alias() {}

  willDestroy() {}
}
