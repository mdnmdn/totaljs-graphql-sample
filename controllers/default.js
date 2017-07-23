exports.install = function() {
	F.route('/', view_index);
	// or
	// F.route('/');
};

function view_index() {
	var self = this;
	self.redirect('/graphiql?query=%7B%0A%20%20testString%0A%7D%0A');
}