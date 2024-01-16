import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Outlet } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './redux/store'
import { StoreProvider } from './utils/GlobalState'

import Nav from './components/Nav'

const httpLink = createHttpLink({
	uri: '/graphql'
})

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('id_token')
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	}
})

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
})

function App() {
	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<StoreProvider>
					<Nav />
					<Outlet />
				</StoreProvider>
			</Provider>
		</ApolloProvider>
	)
}

export default App
