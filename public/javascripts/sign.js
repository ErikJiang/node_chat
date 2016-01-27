$(document).ready(function() {
	$('#register-active').click(function() {
		$('#sign').removeClass('sign').addClass('register');
	});
	$('#login-active').click(function() {
		$('#sign').removeClass('register').addClass('sign');
	});
});
