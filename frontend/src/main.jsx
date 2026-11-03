import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { Provider, useSelector } from "react-redux";
import { apolloClient } from "./lib/apollo";
import { createSampleLink } from "./lib/sampleData";
import { store } from "./store";

const sampleClient = new ApolloClient({
  link: createSampleLink(),
  cache: new InMemoryCache(),
});

function AppWithApollo() {
  const sampleMode = useSelector((state) => state.project.sampleMode);

  return (
    <ApolloProvider
      key={sampleMode ? "sample" : "jira"}
      client={sampleMode ? sampleClient : apolloClient}
    >
      <App />
    </ApolloProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AppWithApollo />
    </BrowserRouter>
  </Provider>
);
