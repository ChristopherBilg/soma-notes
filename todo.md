# ~~To-Do | MVP~~

- [x] Fix Tab functionality
- [x] Fix Shift + Tab functionality
- [x] Fix all areas where we should be re-focusing on input HTML elements
- [x] Create a basic page for /notes/:note
- [x] Make /notes/:note display notes similarly to RightPane
- [x] Make a page for (/user)
  - [x] Basic page should support importing notes (Soma Notes JSON)
  - [x] Basic page should support exporting notes (Soma Notes JSON)

# To-Do | Phase 1

- [x] Turn all `button`s into new components
- [x] Arrow key support for navigating notes
- [x] Hide/show nested notes (using a checkbox?)
- [x] Delete should find the last note the same way that `ArrowUp` does
- [x] Full local development mode (can use environment variables)
- [x] Write down any and all additional features; especially from Notation.app

> Once Phase 1 is complete, I will be able to use this app as my primary
> note-taking app for all of my personal notes (work, side-notes, personal,
> contacts, etc.)

# To-Do | Phase 2

- [x] Button for completing notes
- [x] Breadcrumbs on the /notes/:note page
- [x] Change notes from input to textarea to support multi-line notes
- [x] Small bug: Breadcrumbs not always removing `/` from the end of the path
- [-] Additional auth methods
  - [-] Setup in a way that adding additional OAuth methods is simple
  - [-] As long as the above is true, adding only one additional OAuth method is
    sufficient
- [x] Change all `interfaces` to `types`
- [x] Clean up all code

# To-Do | Phase 3

- [ ] Note linking/highlighting/heatmap
- [ ] Subscriptions using Stripe
- [ ] Note reordering (using Alt + up/down)
- [ ] Clean up all code
