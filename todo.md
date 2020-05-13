## Requests
*  Compare YARA rules' similarity (particularly conditions).
*  Customisable metadata fields (user input).
    * Probably also add:
        * Custom tags
        * Custom artifacts
        * Custom artifact types

## Other
*  Rename post_rule_json and post_commit_json far more sensibly / unambiguously.
* Make encapsulator work with click (surround elements currently in editor div)
* Add some sort of hashed "state" string to URL to reproduce the current editor elements from URL.
* Properly implement showing of column error occurred on (currently just appended to SyntaxError str).
* Split (what's possible) of script blocks into separate .js files.
* Replace all antiquated XHR requests with fetch.
* Fix "Update" YARA rule git diff string to be the proper sanitized/real version.

## Bugs
* Drag and drop won't work until you've added at least one item to the editor, 
  likely issue with no existing items to sort with. 
* Non-default theme loads late, leading to some uncomfortable contrast flashes when it finally gets applied.
    * Set background CSS property early or create a loading screen to be shown until page is actually ready.