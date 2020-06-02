
export const YARA_STRING_SYMBOL = "$";

export const YARA_TYPE_TEXT = "text";
export const YARA_TYPE_HEX = "hex";
export const YARA_TYPE_REGEX = "regex";
export const YARA_TYPES = [YARA_TYPE_TEXT, YARA_TYPE_HEX, YARA_TYPE_REGEX];

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

export function InvalidStringTypeException(message, sType) {
    this.name = "InvalidStringTypeException";
    this.message = message || `Invalid YARA String type '${sType}'!`;
    this.sType = sType;
}

export function InvalidStringModifierException(message, modifier) {
    this.name = "InvalidStringTypeException";
    this.message = message || `Invalid YARA String modifier '${modifier}'!`;
    this.modifier = modifier;
}

export function IllegalStringModifierCombinationException(message, modifier, illegalMatch) {
    this.name = "InvalidStringTypeException";
    this.message = message || `Invalid YARA String modifier '${modifier}'!`;
    this.modifier = modifier;
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
}

export function YARAString(t_sIdentifier, t_value, t_sType=YARA_TYPE_TEXT, t_modifiers=[]) {
    // this.modifiers = [];

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
     const MODIFIER_RESTRICTIONS = {
            YARA_MODIFIER_NO_CASE: [YARA_MODIFIER_XOR, YARA_MODIFIER_BASE64, YARA_MODIFIER_BASE64_WIDE],
            YARA_MODIFIER_WIDE: [],
            YARA_MODIFIER_ASCII: [],
            YARA_MODIFIER_XOR: [YARA_MODIFIER_NO_CASE, YARA_MODIFIER_BASE64, YARA_MODIFIER_BASE64_WIDE],
            YARA_MODIFIER_BASE64: [YARA_MODIFIER_NO_CASE, YARA_MODIFIER_XOR, YARA_MODIFIER_FULL_WORD],
            YARA_MODIFIER_BASE64_WIDE: [YARA_MODIFIER_NO_CASE, YARA_MODIFIER_XOR, YARA_MODIFIER_FULL_WORD],
            YARA_MODIFIER_FULL_WORD: [YARA_MODIFIER_BASE64, YARA_MODIFIER_BASE64_WIDE],
            YARA_MODIFIER_PRIVATE: []
        };

    function isValidType(sType) {
        return (YARA_TYPES.includes(sType));
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

    // function addModifier(newModifier) {
    //     // Get restrictions that apply to currently set modifiers.
    //     let existingRestrictions = [];
    //     for (let existingModifier of YARAString.modifiers) {
    //         existingRestrictions.push(...MODIFIER_RESTRICTIONS[existingModifier])
    //     }
    //
    //     // Check that modifier is not listed in the existing restrictions list.
    //     if (existingRestrictions.includes(newModifier) !== true) {
    //         // Add the modifier.
    //         YARAString.modifiers.push(newModifier);
    //     } else {
    //         throw new IllegalStringModifierCombinationException(null, newModifier, null);
    //     }
    // }

    // function text() {
    //     return `${YARA_STRING_SYMBOL}${YARAString.identifier} = ${this.value}${YARAString.modifiers}`;
    // }

    // Check that constructor input is valid according to the YARA spec:
    // Check that identifier is valid (throws exception if not).
    validateIdentifier(t_sIdentifier);
    this.sIdentifier = t_sIdentifier;

    // Check that the given YARA String type is valid:
    if (isValidType(t_sType) !== true) {
        throw new InvalidStringTypeException(null, sType);
    }
    this.sType = t_sType;

    // Apply operations to modifiers:
    let existingRestrictions = [];
    for (let modifier of t_modifiers) {
        // Check that all modifiers are of valid type.
       if (isValidModifier(modifier) === true) {
           // Add modifier (if invalid combination, throws exception).
           // addModifier(modifier);
           // Get restrictions that apply to currently set modifiers.
           //  for (let existingModifier of this.modifiers) {
           //      existingRestrictions.push(...MODIFIER_RESTRICTIONS[existingModifier])
           //  }
            existingRestrictions.push(...MODIFIER_RESTRICTIONS[modifier]);

            // Check that modifier is not listed in the existing restrictions list.
            if (existingRestrictions.includes(modifier) !== true) {
                // Add the modifier.
                this.modifiers.push(modifier);
            } else {
                throw new IllegalStringModifierCombinationException(null, modifier, null);
            }
       } else {
           throw new InvalidStringModifierException(null, modifier);
       }
    }

    console.log(`Spawned YARA String object: '${this.text()}'`, this)
}

// export { YARAString };