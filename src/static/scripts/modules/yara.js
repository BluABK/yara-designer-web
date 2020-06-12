
export const YARA_STRING_SYMBOL = "$";

export const YARA_TYPE_TEXT = "text";
export const YARA_TYPE_HEX = "hex";
export const YARA_TYPE_REGEX = "regex";
export const YARA_TYPES = [YARA_TYPE_TEXT, YARA_TYPE_HEX, YARA_TYPE_REGEX];

export const YARA_VALUE_TYPE_INT = "int";
export const YARA_VALUE_TYPE_STR = "str";
export const YARA_VALUE_TYPE_BOOL = "bool";
export const YARA_VALUE_TYPES = [YARA_VALUE_TYPE_INT, YARA_VALUE_TYPE_STR, YARA_VALUE_TYPE_BOOL];

export const YARA_MODIFIER_NO_CASE = "nocase";
export const YARA_MODIFIER_WIDE = "wide";
export const YARA_MODIFIER_ASCII = "ascii";
export const YARA_MODIFIER_XOR = "xor";
export const YARA_MODIFIER_BASE64 = "base64";
export const YARA_MODIFIER_BASE64_WIDE = "base64wide";
export const YARA_MODIFIER_FULL_WORD = "fullword";
export const YARA_MODIFIER_PRIVATE = "private";
export const YARA_MODIFIERS =
    [YARA_MODIFIER_NO_CASE, YARA_MODIFIER_WIDE, YARA_MODIFIER_ASCII,
     YARA_MODIFIER_XOR, YARA_MODIFIER_BASE64, YARA_MODIFIER_BASE64_WIDE,
     YARA_MODIFIER_FULL_WORD, YARA_MODIFIER_PRIVATE];

export const YARA_HEX_REGEX = /^(\{\s*)?\(*(\[*[0-9a-fA-F\?\|\-\(\)\[\]]{1,3}\]*)(\s\[*[0-9a-fA-F\?\|\-\(\)\[\]]{1,3}\]*)*\)*\s*(\}\s*)?$/;

var YARAStringSpec = {
    TYPE_ATTR:      "YARAStringType",
    MODIFIER_ATTR:  "YARAStringModifiers",
};

// Exceptions
export function InvalidIdentifierException(message, identifier) {
    this.name = "InvalidIdentifierException";
    this.message = message || `Invalid YARA Identifier '${identifier}'!`;
    this.identifier = identifier;
}

export function InvalidStringTypeException(message, stringType) {
    this.name = "InvalidStringTypeException";
    this.message = message || `Invalid YARA String type '${stringType}'!`;
    this.stringType = stringType;
}

export function InvalidStringModifierException(message, modifier) {
    this.name = "InvalidStringTypeException";
    this.message = message || `Invalid YARA String modifier '${modifier}'!`;
    this.modifier = modifier;
}

export function IllegalStringModifierCombinationException(message, modifier, matchedRestrictions) {
    this.name = "IllegalStringModifierCombinationException";
    this.message = message || `Illegal YARA String modifier combination! '${modifier}' is in restriction list: [${matchedRestrictions}].`;
    this.modifier = modifier;
    this.matchedRestrictions = matchedRestrictions;
}

function isAlphaNumeric(str) {
    let code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)

            return false;
        }
    }
    return true;
}

function isNumeric(str) {
    let code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58)) { // numeric (0-9)
            return false;
        }
    }
    return true;
}

/**
 *  Identifiers must follow the same lexical conventions of the C programming language,
 *  they can contain any alphanumeric character and the underscore character, but the
 *  first character can not be a digit. Rule identifiers are case sensitive and cannot
 *  exceed 128 characters.
 *
 * @param identifier
 */
export function validateIdentifier(identifier) {
    // The first character can not be a digit.
    if (isNumeric(identifier[0]) === true) {
        throw new InvalidIdentifierException(
            `Invalid YARA Identifier '${identifier}', the first character is a digit!`, identifier)
    }

    let code, i, len;

    for (i = 0, len = identifier.length; i < len; i++) {
        code = identifier.charCodeAt(i);

        if (
            !(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code === 95) && // Underscore (_)
            !(code > 96 && code < 123) // lower alpha (a-z)
        ) {
            throw new InvalidIdentifierException(
                `Invalid YARA Identifier '${identifier}', '${identifier[i]}' is not an alphanumeric or underscore character!`, identifier)
        }
    }

    return identifier;
}

function isValidType(stringType) {
    return (YARA_TYPES.includes(stringType));
}

function isValidModifier(modifier) {
    return (YARA_MODIFIERS.includes(modifier));
}

function isValidModifiers(modifiers) {
    for (let modifier of modifiers) {
       if (isValidModifier(modifier) !== true) {
           return false;
       }
    }

    return true;
}

/**
 * Identifiers must follow the same lexical conventions of the C programming language,
 * they can contain any alphanumeric character and the underscore character, but the
 * first character can not be a digit. Rule identifiers are case sensitive and cannot
 * exceed 128 characters.
 *
 * @param identifier
 * @returns {void | string | *}
 */
export function sanitizeIdentifier(identifier) {
    // Match all non-word characters and spaces (everything except numbers and letters).
    let re = /([^\w\s+]|[^\w\S+])/g;

    if ( isNumeric(identifier[0]) ) {
        // If the first character is a digit, prepend an underscore, as the first character can not be a digit.
        identifier = '_' + identifier
    } else if (identifier[0] === ' ' ) {
        // If the first character is a whitespace, strip leading whitespace.
        identifier = identifier.slice(1);
    }

    // Replace all matches with underscore.
    return identifier.replace(re, '_'); // $& means the whole matched string (used with regex /g)
}

 /**
 * YARA String modifier restrictions dict.
 *
 * Each key contains a list of values which it is not allowed to be used in combination with.
 *
 * @type {{YARA_MODIFIER_ASCII: [], YARA_MODIFIER_XOR: [string, string, string], YARA_MODIFIER_PRIVATE: [],
  * YARA_MODIFIER_FULL_WORD: [string, string], YARA_MODIFIER_NO_CASE: [string, string, string],
  * YARA_MODIFIER_BASE64_WIDE: [string, string, string], YARA_MODIFIER_WIDE: [],
  * YARA_MODIFIER_BASE64: [string, string, string]}}
 */
export const YARA_STRING_MODIFIER_RESTRICTIONS = {
    YARA_MODIFIER_NO_CASE: [YARA_MODIFIER_XOR, YARA_MODIFIER_BASE64, YARA_MODIFIER_BASE64_WIDE],
    YARA_MODIFIER_WIDE: [],
    YARA_MODIFIER_ASCII: [],
    YARA_MODIFIER_XOR: [YARA_MODIFIER_NO_CASE, YARA_MODIFIER_BASE64, YARA_MODIFIER_BASE64_WIDE],
    YARA_MODIFIER_BASE64: [YARA_MODIFIER_NO_CASE, YARA_MODIFIER_XOR, YARA_MODIFIER_FULL_WORD],
    YARA_MODIFIER_BASE64_WIDE: [YARA_MODIFIER_NO_CASE, YARA_MODIFIER_XOR, YARA_MODIFIER_FULL_WORD],
    YARA_MODIFIER_FULL_WORD: [YARA_MODIFIER_BASE64, YARA_MODIFIER_BASE64_WIDE],
    YARA_MODIFIER_PRIVATE: []
};

export var YARAString = {
    // Check that identifier is valid (throws exception if not).
    setIdentifier: function(t_stringIdentifier) {
        // Clear any lingering existing setting from a previous object.
        this.clearIdentifier();
        validateIdentifier(t_stringIdentifier);
        this.stringIdentifier = t_stringIdentifier;
    },

    clearIdentifier: function() {
        this.stringModifiers = [];
    },

    getIdentifier: function() { return this.stringIdentifier },
    
    setValue: function(t_value) {
        // Clear any lingering existing setting from a previous object.
        this.clearValue();
        this.stringValue = t_value;
    },

    clearValue: function() {
        this.stringModifiers = [];
    },

    getValue: function() { return this.stringValue },

    setType: function(t_stringType = YARA_TYPE_TEXT) {
        // Clear any lingering existing setting from a previous object.
        this.clearType();
        // Check that the given YARA String type is valid.
        if (isValidType(t_stringType) === true) {
            this.stringType = t_stringType;
        } else {
            throw new InvalidStringTypeException(null, t_stringType);
        }

    },

    clearType: function() {
        this.stringModifiers = [];
    },

    getType: function() { return this.stringType },

    addModifier: function (t_modifier) {
        if (isValidModifier(t_modifier) === true) {
            // Get restrictions that apply to currently set modifiers.
            let existingRestrictions = [];
            for (let existingModifier of this.stringModifiers) {
                // NOTE: Apparently can't access JSON object values from a prototype,
                // so uses switch-case to get the job done.
                let restrictions = [];
                switch(existingModifier) {
                    case YARA_MODIFIER_NO_CASE:
                        restrictions = [YARA_MODIFIER_XOR, YARA_MODIFIER_BASE64, YARA_MODIFIER_BASE64_WIDE];
                        break;
                    case YARA_MODIFIER_WIDE:
                        break;
                    case YARA_MODIFIER_ASCII:
                        break;
                    case YARA_MODIFIER_XOR:
                        restrictions = [YARA_MODIFIER_NO_CASE, YARA_MODIFIER_BASE64, YARA_MODIFIER_BASE64_WIDE];
                        break;
                    case YARA_MODIFIER_BASE64:
                        restrictions = [YARA_MODIFIER_NO_CASE, YARA_MODIFIER_XOR, YARA_MODIFIER_FULL_WORD];
                        break;
                    case YARA_MODIFIER_BASE64_WIDE:
                        restrictions = [YARA_MODIFIER_NO_CASE, YARA_MODIFIER_XOR, YARA_MODIFIER_FULL_WORD];
                        break;
                    case YARA_MODIFIER_FULL_WORD:
                        restrictions = [YARA_MODIFIER_BASE64, YARA_MODIFIER_BASE64_WIDE];
                        break;
                    case YARA_MODIFIER_PRIVATE:
                        break;
                    default:
                        console.error(
                            "existingModifier switch case should not have reached default!", existingModifier);
                        break;
                }

                // Make sure not to add duplicate entries to the restrictions list.
                let restrictionsAlreadyInList = false;
                for (let restriction of restrictions) {
                    if (existingRestrictions.includes(restriction)) {
                        restrictionsAlreadyInList = true;
                    }
                }

                // Update restrictions list, if the restrictions were new.
                if (!restrictionsAlreadyInList) {
                    existingRestrictions.push(...restrictions);
                }
            }

            // Check that modifier is not listed in the existing restrictions list.
            if (existingRestrictions.includes(t_modifier) !== true) {
                // Add the modifier.
                this.stringModifiers.push(t_modifier);
            } else {
                throw new IllegalStringModifierCombinationException(null, t_modifier, existingRestrictions);
            }
        } else {
           throw new InvalidStringModifierException(null, t_modifier);
       }
    },

    setModifiers: function(t_modifiers = []) {
        // Clear any lingering existing modifiers from a previous object.
        this.clearModifiers();
        for (let modifier of t_modifiers) {
            this.addModifier(modifier)
        }
    },

    clearModifiers: function() {
        this.stringModifiers = [];
    },

    getModifiers: function() { return Array.isArray(this.stringModifiers) ? this.stringModifiers : []},

    clear: function() {
        this.clearIdentifier();
        this.clearType();
        this.clearValue();
        this.clearModifiers();
    },
    
    text: function() { // FIXME: Implement the other YARA String types!
        if (this.stringType === YARA_TYPE_TEXT) {
            let modifiers = this.getModifiers();
            let modStr = '';
            if (this.stringModifiers.length > 0) {
                modStr = ` ${modifiers.join(' ')}` // NB: has a single space in front.
            }

            return `${YARA_STRING_SYMBOL}${this.getIdentifier()} = "${this.getValue()}"${modStr}`;
        }
    }
};

export function createYARAString(t_stringIdentifier, t_value, t_stringType=YARA_TYPE_TEXT, t_modifiers=[]) {
    let ys = Object.create(YARAString);

    ys.setIdentifier(t_stringIdentifier);
    ys.setValue(t_value);
    ys.setType(t_stringType);
    ys.setModifiers(t_modifiers);

    // console.log(`Spawned YARA String object: '${ys.text()}'`, ys);

    return ys;
}
