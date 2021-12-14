var ghpages = require('gh-pages');

ghpages.publish(
	'public', // path to public directory
	{
		branch: 'gh-pages',
		repo: 'https://github.com/Quargle/Portfolio.git', // Update to point to your repository
		user: {
			name: 'Samuele', // update to use your name
			email: 'samuele@stranianelli.com' // Update to use your email
		},
		dotfiles: true
	},
	() => {
		console.log('Deploy Complete!');
	}
);