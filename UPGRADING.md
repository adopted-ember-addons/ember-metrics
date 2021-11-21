# Upgrade to v2

## Updating your adapters

1. The Base adapter no longer inherits from EmberObject. Any usages of this API by
   your custom adapter must be removed, or replaced with some equivalent.
2. Rename your `init` method to `install`.
3. Rename your `willDestroy` method to `uninstall`.
