/**
 * The object containing the current or computed state of the designer.
 */
class DesignerState {
    constructor() {
        this._added_on = null;
        this._compilable = null;
        this._condition = [];
        this._condition_str = "";
        this._last_modified = null;
        this._meta = [];
        this._name = "";
        this._namespace = null;
        this._pending = false;
        this._processing_time = null;
        this._source_filename = null;
        this._source_path = "";
        this._source_path_sha256sum = null;
        this._strings = [];
        this._tags = [];
        this._thehive_case_id = null;
        this._title = "";
        this._description = "";

        // Valid JSON setters.
        this._jsonPropertySetters = [
            "added_on", "compilable", "condition", "condition_str", "last_modified", "meta", "name", "namespace",
            "pending", "processing_time", "source_filename", "source_path", "source_path_sha256sum", "strings",
            "tags", "thehive_case_id", "title", "description"];
    }

    get added_on() {
        return this._added_on;
    }

    set added_on(value) {
        this._added_on = value;
    }

    get compilable() {
        return this._compilable;
    }

    set compilable(value) {
        this._compilable = value;
    }

    get condition() {
        return this._condition;
    }

    set condition(value) {
        this._condition = value;
    }

    get condition_str() {
        return this._condition_str;
    }

    set condition_str(value) {
        this._condition_str = value;
    }

    get last_modified() {
        return this._last_modified;
    }

    set last_modified(value) {
        this._last_modified = value;
    }

    get meta() {
        return this._meta;
    }

    set meta(value) {
        this._meta = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get namespace() {
        return this._namespace;
    }

    set namespace(value) {
        this._namespace = value;
    }

    get pending() {
        return this._pending;
    }

    set pending(value) {
        this._pending = value;
    }

    get processing_time() {
        return this._processing_time;
    }

    set processing_time(value) {
        this._processing_time = value;
    }

    get source_filename() {
        return this._source_filename;
    }

    set source_filename(value) {
        this._source_filename = value;
    }

    get source_path() {
        return this._source_path;
    }

    set source_path(value) {
        this._source_path = value;
    }

    get source_path_sha256sum() {
        return this._source_path_sha256sum;
    }

    set source_path_sha256sum(value) {
        this._source_path_sha256sum = value;
    }

    get strings() {
        return this._strings;
    }

    set strings(value) {
        this._strings = value;
    }

    get tags() {
        return this._tags;
    }

    set tags(value) {
        this._tags = value;
    }

    get thehive_case_id() {
        return this._thehive_case_id;
    }

    set thehive_case_id(value) {
        this._thehive_case_id = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    /**
     * Get all properties as a JSON object.
     *
     * @returns {{thehive_case_id: null, processing_time: null, pending: boolean, description: string, title: string, source_path_sha256sum: null, tags: [], condition: [], strings: [], compilable: null, meta: [], source_filename: null, name: string, namespace: null, condition_str: string, source_path: string, added_on: null, last_modified: null}}
     */
    get json() {
        console.log("Getting all properties as a JSON object.")
        return {
            "added_on": this.added_on,
            "compilable": this.compilable,
            "condition": this.condition,
            "condition_str": this.condition_str,
            "last_modified": this.last_modified,
            "meta": this.meta,
            "name": this.name,
            "namespace": this.namespace,
            "pending": this.pending,
            "processing_time": this.processing_time,
            "source_filename": this.source_filename,
            "source_path": this.source_path,
            "source_path_sha256sum": this.source_path_sha256sum,
            "strings": this.strings,
            "tags": this.tags,
            "thehive_case_id": this.thehive_case_id,
            "title": this.title,
            "description": this.description
        }
    }

    /**
     * Set all properties from a JSON object.
     *
     * @param jsonObj
     */
    set json(jsonObj) {
        console.log("Setting all properties from a JSON object.", jsonObj)
        // Ensure that the given jsonObj is complete.
        for (let key in this.json) {
            if (!jsonObj.hasOwnProperty(key)) {
                console.error("Got served incomplete JSON, did you mean to use fromPartialJson?", jsonObj, this.json);

                return;
            }
        }

        // Call each JSON setter.
        this.added_on = jsonObj["added_on"];
        this.compilable = jsonObj["compilable"];
        this.condition = jsonObj["condition"];
        this.condition_str = jsonObj["condition_str"];
        this.last_modified = jsonObj["last_modified"];
        this.meta = jsonObj["meta"];
        this.name = jsonObj["name"];
        this.namespace = jsonObj["namespace"];
        this.pending = jsonObj["pending"];
        this.processing_time = jsonObj["processing_time"];
        this.source_filename = jsonObj["source_filename"];
        this.source_path = jsonObj["source_path"];
        this.source_path_sha256sum = jsonObj["source_path_sha256sum"];
        this.strings = jsonObj["strings"];
        this.tags = jsonObj["tags"];
        this.thehive_case_id = jsonObj["thehive_case_id"];
        this.title = jsonObj["title"];
        this.description = jsonObj["description"];
    }

    /**
     * Set some properties from a JSON object.
     *
     * @param jsonObj
     */
    fromPartialJson(jsonObj) {
        // Generate a complete JSON object to be modified.
        let myJson = this.json;

        // Iterate over all possible valid keys and assign values given by jsonObj.
        for (let key in myJson) {
            if (jsonObj.hasOwnProperty(key)) {
                myJson[key] = jsonObj[key]
            }
        }

        // Set properties from the modified complete JSON object.
        console.log("Set properties from the modified complete JSON object.", myJson, this.json)
        this.json = myJson;
    }
}

/**
 * Helper function for spawning a DesignerState object properly.
 *
 * Useful to make sure you don't fall in any of the common pitfalls.
 *
 * @returns {DesignerState}
 */
export function newDesignerState() {
    // Spawn a new instance.
    let dsObj = new DesignerState();

    // Seal object properties to make sure non-existent properties actually throw errors.
    // See: https://nemisj.com/why-getterssetters-is-a-bad-idea-in-javascript/
    Object.seal(dsObj);

    // Return the - now sealed - instance.
    return dsObj;
}