<%= importStatement %>

export default <%= baseClass %>.extend({
  toStringExtension() {
    <%= toStringExtension %>
  },

  /*
    This method is called when the adapter is created. It is responsible for
    injecting the script tag and initializing it.
  */
  init() {

  },

  identify() {

  },

  trackEvent() {

  },

  trackPage() {

  },

  alias() {

  }
});
