let rowIndex = 0;
let intervalId = false;
let numRows = 24;
$("#RowNum").val(numRows);
const $wrapper = $('#wrapper');
const marbleMachineVideo = document.getElementById("marbleMachineVideo");


// load audio samples:
const sample1 = new Tone.Player({
	url: './samples/K.wav',
	loop: false,
	retrigger: true
}).toMaster();
const sample2 = new Tone.Player({
	url: './samples/S.wav',
	loop: false,
	retrigger: true
}).toMaster();
const sample3 = new Tone.Player({
	url: './samples/C.wav',
}).toMaster();

const vibraphone = new Tone.Sampler({
	'G3': '1.wav',
	'A3': '2.wav',
	'B3': '3.wav',
	'C3': '4.wav',
	'D3': '5.wav',
	'E3': '6.wav',
	'F3': '7.wav'
}, {
	'release': 1,
	'baseUrl': './samples/'
}).toMaster();


function makeCheckbox($row, i, j) {
	const $input = $('<div class="cell"><input type="checkbox"></div>');
	$row.append($input);
};


function makeRow(i) {
	const $row = $('<div class="row"></div>');
	$wrapper.append($row);
	for (let j = 0; j < 10; j++) {
		makeCheckbox($row, i, j);
	}
};


function Pause() {
	clearInterval(intervalId);
	intervalId = false;
	marbleMachineVideo.pause();
}


function Play() {
	if (intervalId !== false) {
		return;
	}

	intervalId = setInterval(
		() => {
			const $rows = $('.row');
			$rows.removeClass('active');
			const $currentRow = $rows.eq(rowIndex);
			$currentRow.addClass('active');

			const $checkboxes = $currentRow.find('input[type=checkbox]');
			// for each checkbox in the current row, return either `1` or `0`
			// and store the results in an array:
			const rowNotes = $checkboxes.map(function(i, elem) {
				const $checkbox = $(elem);
				if ($checkbox.is(":checked")) {
					return 1;
				} else {
					return 0;
				};
			});

			if (rowNotes[0] === 1) {
				sample1.start();
			}
			if (rowNotes[1] === 1) {
				sample2.start();
			}
			if (rowNotes[2] === 1) {
				sample3.start();
			}
			if (rowNotes[3] === 1) {
				vibraphone.triggerAttack('G3');
			}
			if (rowNotes[4] === 1) {
				vibraphone.triggerAttack('A3');
			}
			if (rowNotes[5] === 1) {
				vibraphone.triggerAttack('B3');
			}
			if (rowNotes[6] === 1) {
				vibraphone.triggerAttack('C3');
			}
			if (rowNotes[7] === 1) {
				vibraphone.triggerAttack('D3');
			}
			if (rowNotes[8] === 1) {
				vibraphone.triggerAttack('E3');
			}
			if (rowNotes[9] === 1) {
				vibraphone.triggerAttack('F3');
			}
			rowIndex = (rowIndex + 1) % numRows;
		},
		500
	);

	marbleMachineVideo.play();
}


function Reset() {
	$('input[type=checkbox]').prop('checked', false);
}


function setNumRows(newNumRows) {
	const diff = newNumRows - numRows;
	if (diff === 0) {
		// nothing to do here
		return;
	}

	if (diff > 0) {
		// add more rows
		for (let i = 0; i < diff; i++) {
			makeRow(numRows + i);
		}
	} else {
		// remove extra rows
		const $rows = $('.row');
		for (let i = 0; i < numRows; i++) {
			if (i >= newNumRows) {
				const $row = $rows.eq(i);
				$row.remove();
			}
		}
	}

	numRows = newNumRows;
}


function Adjust() {
	let value = $("#RowNum").val();
	value = parseInt(value, 10);
	setNumRows(value);
	rowIndex = 0;
}


function GoToTop() {
	rowIndex = 0;
	const $rows = $('.row');
	$rows.removeClass('active');
	Pause();
}


// init rows
for (let i = 0; i < numRows; i++) {
	makeRow(i);
}

// register event handlers
$("#Pause_track").on('click', Pause);
$("#Play_track").on('click', Play);
$("#Reset").on('click', Reset);
$("#change-button").on('click', Adjust);
$("#Go_To_Top").on('click', GoToTop);
