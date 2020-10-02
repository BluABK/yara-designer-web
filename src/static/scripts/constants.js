// MIME Types:
export const MIMETYPE_JSON = 'application/json';

// Root:
export const ROOT_CLASS = 'yara-rule-designer';

// Rule stuff:
export const RULE_KIND_DB = "database";
export const RULE_KIND_THEORACLE = "theoracle";

// Modifying classes
export const SIZE_WIDE_CLASS = "size-wide";
export const SIZE_FULLWIDTH_CLASS = "size-fullwidth";

// Tables:
export const CUSTOM_TABLE_CLASS = "custom-table";
export const CUSTOM_TABLE_CONTAINER = `${CUSTOM_TABLE_CLASS}-container`;
export const TABLE_FILTER_INPUT_SUFFIX = "input-filter";
export const TABLE_FILTER_RADIO_CLASS_SUFFIX = `${TABLE_FILTER_INPUT_SUFFIX}-radios`;
export const TABLE_FILTER_COUNT = "filter-count";
export const TABLE_FILTER_CHECKED_RADIO = "Title";
export const TABLE_FILTER_HIDDEN_RADIOS = ["Pending"];

// Table: -- Fetched Rules
export const RULES_TABLE = "fetched-rules";

// Designer:
export const HTML_TITLE = `${ROOT_CLASS}-title`;
export const DESIGNER_HEADER = `${ROOT_CLASS}-header`;
export const DESIGNER_HEADER_CONTENT = `${DESIGNER_HEADER}-content`;
export const DESIGNER_HEADER_CONTENT_TITLE = `${DESIGNER_HEADER_CONTENT}-title`;
export const DESIGNER_HEADER_CONTENT_BYLINE = `${DESIGNER_HEADER_CONTENT}-byline`;
export const DESIGNER_HEADER_CONTENT_DESCRIPTION = `${DESIGNER_HEADER_CONTENT}-description`;

export const DESIGNER_TAGS = `${ROOT_CLASS}-tags`;
export const DESIGNER_TAGS_CHECKBOX_CLASS = "yara-tag-checkbox";
export const OPERATOR_CONTAINER = `${ROOT_CLASS}-operators`;
export const YARA_STRING_EDITOR_ELEMENT = `yara-string-editor-element`;
export const YARA_STRING_EDITOR_ELEMENT_CLASS = `condition-yara-string-editor-element`;
export const YARA_STRING_EDITOR_ELEMENT_CONTAINER = `${ROOT_CLASS}-yara-string-editor-element`;
export const CUSTOM_YARA_STRING_EDITOR_ELEMENT = `custom-yara-string-editor-element`;
export const CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS = `condition-custom-yara-string-editor-element`;
export const CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER = `${ROOT_CLASS}-custom-yara-string-editor-elements`;
export const LEFTPANE_DRAGGABLES = [OPERATOR_CONTAINER, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER, YARA_STRING_EDITOR_ELEMENT_CONTAINER];
export const LEFTPANE_YARA_STRING_ELEMENT_CONTAINERS = [CUSTOM_YARA_STRING_EDITOR_ELEMENT_CONTAINER, YARA_STRING_EDITOR_ELEMENT_CONTAINER];
export const YARA_STRING_ELEMENT_JSON_DATA_ATTR = "data-yara-string-json";
export const YARA_STRING_TYPE_CLASS_TEXT = "yara-string-type-text";
export const YARA_STRING_TYPE_CLASS_HEX = "yara-string-type-hex";
export const YARA_STRING_TYPE_CLASS_REGEX = "yara-string-type-regex";

export const DESIGNER_EDITOR = `${ROOT_CLASS}-editor`;

// Text and styling:
export const NUMBERED_TEXTBOX_CLASS = "numbered-lines";
export const SUCCESS_ICON = "<span style='color: green'>&#10003;</color>";
export const FAILED_ICON = "<span style='color: red'>&#10005;</span>";
export const BGCOLOR_RED_CLASS = "red-bg";
export const BGCOLOR_YELLOW_CLASS = "yellow-bg";
export const TEXT_COLOR_GREEN_CLASS = "green-text";
export const TEXT_COLOR_RED_CLASS = "red-text";
export const YARA_VARIABLE_DENOMINATOR = "$";

// Convenience/readability constants:
export const MOUSE_CLICK_LEFT = 0;
export const MOUSE_CLICK_MIDDLE = 1;
export const MOUSE_CLICK_RIGHT = 2;
export const OBSERVABLE_CLASSES = [YARA_STRING_EDITOR_ELEMENT_CLASS, CUSTOM_YARA_STRING_EDITOR_ELEMENT_CLASS];
export const KEYWORD_CLASS = "condition-keyword";
export const KEYWORD_CLASSES = ["condition-keyword"];
export const VAR_COUNT_KEYWORD = "condition-keyword-count";
export const NUMERIC_CLASS = "condition-numeric";
export const NUMERIC_CLASSES = ["condition-numeric"];
export const SYNTAX_ERROR = "syntax";

// Customised modals - Settings Modal:
export const SETTINGS_MODAL_GENERAL_FORM = "settings-modal-general-form";
export const SETTINGS_MODAL_GENERAL_FORM_COLUMN_TITLE_INPUT = "general-settings-title-column-input";
export const SETTINGS_MODAL_SAVE_ALL_BUTTON = "settings-modal-save-all-button";
export const SETTINGS_MODAL_META_FORM = "settings-modal-meta-form";
export const SETTINGS_MODAL_META_FORM_ROW = "yara-meta-";
export const SETTINGS_MODAL_META_FORM_DELETE_ROW_BUTTON_PREFIX = `${SETTINGS_MODAL_META_FORM_ROW}-delete-this-row-button`;
export const SETTINGS_MODAL_META_FORM_ADD_ROW_BUTTON = `${SETTINGS_MODAL_META_FORM_ROW}-add-row-button`;
export const SETTINGS_MODAL_META_FORM_COLUMN_IDENTIFIER_CLASS = "col-md-3 mb-3";
export const SETTINGS_MODAL_META_FORM_COLUMN_VALUE_CLASS = "col-md-7 mb-3";
export const SETTINGS_MODAL_META_FORM_COLUMN_VALUE_TYPE_CLASS = "col-md-1 mb-3";
export const SETTINGS_MODAL_META_FORM_COLUMN_DELETE_ROW_CLASS = "col-md-1 mb-3";

// Customised modals - Add Custom YARA String to editor Modal:
export const ADD_CUSTOM_YARA_STRING_MODAL_ADD_BUTTON = "add-custom-yara-string-modal-add-button";
export const ADD_CUSTOM_YARA_STRING_MODAL_SAVE_BUTTON = "add-custom-yara-string-modal-save-button";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM = "add-custom-yara-string-modal-form";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM}-row`;
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN = `${ADD_CUSTOM_YARA_STRING_MODAL_FORM}-column`;
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_IDENTIFIER_CLASS = "col-md-3 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_VALUE_CLASS = "col-md-7 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_VALUE_TYPE_CLASS = "col-md-1 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_COLUMN_STRING_TYPE_CLASS = "col-md-1 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_CLASS = `form-row ${ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW}-modifiers`;
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_HEADING_COLUMN_CLASS = "col-md-1 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_COLUMN_CHECKBOX_CLASS = "col-md-2 mb-3";
export const ADD_CUSTOM_YARA_STRING_MODAL_FORM_ROW_MODIFIERS_COLUMN_DATA_INPUT_CLASS = "col-md-10 mb-3";