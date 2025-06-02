const express = require('express');
const app = express();
app.use(express.json());

let scores = [
  { id: 1, homeTeam: 'Team A', awayTeam: 'Team B', score: '2-1' },
  { id: 2, homeTeam: 'Team C', awayTeam: 'Team D', score: '1-1' }
];

// Get all scores
app.get('/scores', (req, res) => res.json(scores));

// Create a new score
app.post('/scores', (req, res) => {
  const { homeTeam, awayTeam, score } = req.body;
  const newScore = { id: scores.length + 1, homeTeam, awayTeam, score };
  scores.push(newScore);
  res.status(201).json(newScore);
});

// Update a score
app.put('/scores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { homeTeam, awayTeam, score } = req.body;
  const index = scores.findIndex(s => s.id === id);

  if (index === -1) return res.status(404).send({ message: 'Match not found' });

  scores[index] = { id, homeTeam, awayTeam, score };
  res.json(scores[index]);
});

// Delete a score
app.delete('/scores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = scores.findIndex(s => s.id === id);

  if (index === -1) return res.status(404).send({ message: 'Match not found' });

  const deleted = scores.splice(index, 1);
  res.json(deleted[0]);
});

// Health endpoint
app.get('/health', (req, res) => res.json({ status: 'UP' }));

// Serve a basic HTML page that shows the football scores
app.get('/web', (req, res) => {
    const html = `
    <html>
      <head>
        <title>Football Scores</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          h1 {
            text-align: center;
            color: #2c3e50;
          }
          table {
            width: 60%;
            margin: 20px auto;
            border-collapse: collapse;
            background-color: #fff;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #2c3e50;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Football Match Scores</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody id="scores"></tbody>
        </table>
        <script>
          fetch('/scores')
            .then(response => response.json())
            .then(data => {
              const scoresTable = document.getElementById('scores');
              data.forEach(match => {
                const row = document.createElement('tr');
                row.innerHTML = \`
                  <td>\${match.id}</td>
                  <td>\${match.homeTeam}</td>
                  <td>\${match.awayTeam}</td>
                  <td>\${match.score}</td>
                \`;
                scoresTable.appendChild(row);
              });
            });
        </script>
      </body>
    </html>
    `;
    res.send(html);
  });
  
  

// Start server
const port = process.env.PORT || 3000;
if (require.main === module) {
app.listen(port, () => console.log(`Server running on port ${port}`));
}
module.exports = app; // for testing
