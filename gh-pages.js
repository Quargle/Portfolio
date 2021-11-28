var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/quargle/portfolio.git', // Update to point to your repository  
        user: {
            name: 'Peter Evans', // update to use your name
            email: 'ph31pe@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)