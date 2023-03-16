const lodash = require("lodash");

exports.orderBy = (studentsYear, orderBasedOn, orderType = "asc") => {
	// transform string to integer
	studentsYear = lodash.each(studentsYear, (item) => {
		item[orderBasedOn] = parseInt(item[orderBasedOn], 10);
	});

	// order array
	studentsYear = lodash.orderBy(studentsYear, [orderBasedOn], [orderType]);

	return studentsYear;
};

exports.arrayToObject = (arr, key) => {
	return arr.reduce((obj, item) => {
		obj[item[key]] = item;
		return obj;
	}, {});
};

exports.toNumber = (number) => {
	if (number !== null && number !== NaN) {
		number = number.replace(",", ".");
		number = parseFloat(number);
	}

	return number;
};

exports.toString = (number) => {
	if (number == NaN) {
		return "";
	}
	if (number !== null && number !== undefined && number !== "") {
		number = parseFloat(number).toFixed(2);
		number = number.replace(".", ",");
	}

	return number;
};
