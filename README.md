# AI-agent-assessment

TriageIQ is a Jira dashboard for reviewing tickets, delivery health, team
capacity, and sprint plans. It uses a React frontend and a Fastify GraphQL
backend.

## Preview the sample UI

From the `frontend` directory, install dependencies and start the development
server:

```sh
npm install
npm run dev
```

Open the displayed local URL and select **View sample data**. The sample data
is illustrative, does not require Jira or the backend, and cannot be committed
to Jira.

## Configure Jira

The backend requires MongoDB and a Jira OAuth application. Copy the root
`.env.example` to `.env` in the `backend` directory and configure its values.
Then install dependencies and run `npm run dev` from `backend`. Keep `.env`
files and credentials out of Git.