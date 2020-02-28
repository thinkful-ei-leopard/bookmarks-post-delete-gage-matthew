function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'google',
      url: 'https://www.google.com',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mollis mauris at faucibus ullamcorper. Curabitur lorem magna, commodo ut ante convallis, gravida sodales massa.',
      rating: 5
    },
    {
      id: 2,
      title: 'Thinkful',
      url: 'https://www.thinkful.com',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mollis mauris at faucibus ullamcorper. Curabitur lorem magna, commodo ut ante convallis, gravida sodales massa.',
      rating: 5
    },
    {
      id: 3,
      title: 'github',
      url: 'https://www.github.com',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mollis mauris at faucibus ullamcorper. Curabitur lorem magna, commodo ut ante convallis, gravida sodales massa.',
      rating: 4
    }
  ];
}

function makeMaliciousBookmark() {
  const maliciousBookmark = {
    id: 999,
    title: 'Malicious Attack <script>alert("I am attacking");</script>',
    url: 'https://www.example.com',
    description: 'Another Attack <img src="nope.jpg" onerror="alert(document.cookie);">',
    rating: 1
  };

  const expectedBookmark = {
    ...maliciousBookmark,
    title: 'Malicious Attack &lt;script&gt;alert(\"I am attacking\");&lt;/script&gt;',
    description: 'Another Attack <img src>'
  };
  return {
    maliciousBookmark, expectedBookmark
  };
}

module.exports = {makeBookmarksArray, makeMaliciousBookmark};