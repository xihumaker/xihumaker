var mail = require('./mail');

mail.sendResetPassMail('244098979@qq.com', '123', function(res) {
	console.log(res);
});

//mail.sendActiveMail('244098979@qq.com', '123', function(res) {
//	console.log(res);
//}); 