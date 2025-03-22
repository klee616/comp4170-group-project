function cleanJson(input) {
    if (Array.isArray(input)) {
        const cleanedArray = input.map(cleanJson).filter(value => value !== null && value !== "");
        return cleanedArray.length > 0 ? cleanedArray : null; // Return `null` if empty
    } else if (typeof input === "object" && input !== null) {
        const cleanedObject = Object.fromEntries(
            Object.entries(input)
                .map(([key, value]) => [key, cleanJson(value)])
                .filter(([_, value]) => value !== null && value !== "")
        );
        return Object.keys(cleanedObject).length > 0 ? cleanedObject : null; // Return `null` if empty
    }
    return input;
}


export default  { cleanJson };
