import React from 'react'
import { render } from 'react-dom'
import { Router } from '@reach/router'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import HomeScreen from './screens/home'
import PokemonScreen from './screens/pokemon'
import * as S from './styled'
import * as serviceWorker from './serviceWorker'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
})

const theme = {
  baseFontSize: '15px',
  fontFamily: "'Lexend Deca', sans-serif",
  white: '#fff',
  black: '#232323',
  lightBlue: '#E8F0FF',
  purpe: '#313B72',
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.white};
    color: ${props => props.theme.black};
    width: 100vw;
    height: 100vh;
    margin: 0;
    font-family: ${props => props.theme.fontFamily};
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <S.Screens>
            <Router>
              <HomeScreen path="/" />
              <PokemonScreen path="/:num" />
            </Router>
          </S.Screens>
        </>
      </ThemeProvider>
    </ApolloProvider>
  )
}

render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
