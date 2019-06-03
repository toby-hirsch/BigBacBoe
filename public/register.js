var socket = io('http://localhost:8080');

const PASS_LENGTH_ERROR = 0;
const USER_TAKEN_ERROR = 1;
const INVALID_EMAIL_ERROR = 2;
const PASSWORD_MATCH_ERROR = 3;


const errormessages = [
	'Password should be at least eight characters',
	'Username taken',
	'Invalid email address',
	'Passwords must match'
];


socket.on('regdone', function(){
	loggedon = true;
	redirect('buttonContainer');
});


socket.on('regerror', function(errorid){
	console.log('error received');
	var errordiv = $('#regerror');
	errordiv.html(errormessages[errorid]).fadeIn(100);
	setTimeout(function(){errordiv.fadeOut(1000)}, 1000);
});

socket.on('setid', function(pid){
	id = pid;
	console.log(id);
	$('#hiddenid').attr('value', id);
});

$('#regForm').on('submit', function(e){
	e.preventDefault();
	var inputs = $('#regForm :input');
	var values = {};
	inputs.each(function() {
		values[this.name] = $(this).val();
	});
	socket.emit('regform', values);
});