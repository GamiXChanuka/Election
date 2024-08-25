document.addEventListener('DOMContentLoaded', (event) => {
    const candidate1VotesElement = document.getElementById('candidate1-votes');
    const candidate2VotesElement = document.getElementById('candidate2-votes');
    const candidate3VotesElement = document.getElementById('candidate3-votes');
    const candidate4VotesElement = document.getElementById('candidate4-votes');

    // Fetch votes and update the UI
    function fetchVotes() {
        fetch('http://localhost:3002/votes')
            .then(response => response.json())
            .then(data => {
                if (candidate1VotesElement) {
                    candidate1VotesElement.innerText = data['Candidate 1'] || 0;
                }
                if (candidate2VotesElement) {
                    candidate2VotesElement.innerText = data['Candidate 2'] || 0;
                }
                if (candidate3VotesElement) {
                    candidate3VotesElement.innerText = data['Candidate 3'] || 0;
                }
                if (candidate4VotesElement) {
                    candidate4VotesElement.innerText = data['Candidate 4'] || 0;
                }
            })
            .catch(error => console.error('Error fetching votes:', error));
    }

    // Call fetchVotes on page load
    fetchVotes();

    // Handle voting
    window.vote = function(candidate) {
        fetch('http://localhost:3002/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ candidate: candidate }),
        })
        .then(response => {
            if (response.ok) {
                return fetchVotes();  // Refresh votes after successful submission
            } else {
                throw new Error('Failed to submit vote.');
            }
        })
        .catch(error => console.error('Error submitting vote:', error));
    };
});
