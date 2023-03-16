// ARRAY
export const insertIntoArray = (arr, index, newItem) => [
	// part of the array before the specified index
	...arr.slice(0, index),
	// inserted item
	newItem,
	// part of the array after the specified index
	...arr.slice(index),
];

// STRING
export const getObservation = (observation, phraseApplayCondition, lineBreakAt) => {
	let observationString = observation !== null && observation !== undefined ? observation : "";

	observationString = observationString.split(" ");
	if (observationString.length >= phraseApplayCondition) {
		observationString = insertIntoArray(observationString, lineBreakAt, "\n ");
	}
	observationString[0] = observationString[0].charAt(0).toUpperCase() + observationString[0].slice(1);
	observationString = observationString.join(" ").replace("  ", "");

	return observationString;
};

export const calcPercentage = (all, rest, floatFormat = true) => {
	const result = (all / rest) * 100;
	if (floatFormat === true) {
		return result.toFixed(2);
	} else {
		return Math.round(result);
	}
};
