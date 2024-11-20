import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './pages/ErrorBoundary/ErrorBoundary.jsx';

import {
  NavBar,
  SearchProvider,
} from './components/index.js';


const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  return (
    <ErrorBoundary>
      <SearchProvider>
        <ApolloProvider client={client}>
          <NavBar />
          <style>{'body { background-color: #303134; }'}</style>
          <ToastContainer />
          <Outlet />
        </ApolloProvider>
      </SearchProvider>
    </ErrorBoundary>
  );
}

export default App;

