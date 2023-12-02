// import react-router to deal with routes and pages interconnexion
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CartStateProvider } from './lib/cartState';
import UserStateProvider from './components/User';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { gqlEndpoint } from './config';

// import all pages & components here
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import SingleProductPage from './pages/SingleProductPage';
import CartPage from './pages/CartPage';
import AddProduct from './pages/AddProduct';
import SigninPage from './pages/SigninPage';
import Dashboard from './pages/Dashboard';
import EditProduct from './pages/EditProduct';

// setting up apollo client to use it for graphQL queries & mutations
const httpLink = createHttpLink({
  uri: gqlEndpoint,
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
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
    <ApolloProvider client={client}>
      <UserStateProvider>
        <CartStateProvider>
          <div className='app'>
            <Router>
              <Header />
              <Switch>
                <Route exact path='/' component={HomePage} />
                <Route path='/products' component={ProductsPage} />
                <Route path='/product/:id' component={SingleProductPage} />
                <Route path='/cart' component={CartPage} />
                <Route path='/signin' component={SigninPage} />
                <Route path='/addproduct' component={AddProduct} />
                <Route path='/editproduct/:id' component={EditProduct} />
                <Route path='/dashboard' component={Dashboard} />
              </Switch>
            </Router>
          </div>
        </CartStateProvider>
      </UserStateProvider>
    </ApolloProvider>
  );
}

export default App;
