import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router';
import {ApolloProvider} from '@apollo/client';
import client from './graphql/client';
import '@ant-design/v5-patch-for-react-19';
import HomePage from './pages/HomePage';
import PersonDetailPage from './pages/PersonDetailPage';
import './reset.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/people/:id" element={<PersonDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>,
  );
} else {
  console.error('Failed to find the root element');
}
