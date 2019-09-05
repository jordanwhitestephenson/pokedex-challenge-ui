import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { navigate } from '@reach/router'
import { IconButton } from '@material-ui/core'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import Dropdown from "react-dropdown";
import _ from 'lodash'

import PokemonCard from '../../components/PokemonCard'
import * as S from './styled'

export default function PokemonScreen({ num }) {
  const { loading, error, data } = useQuery(gql`
    {
      pokemonOne(id: ${num.replace(/0/g, '')}) {
        num
        name
        img
        weight
        height
        typeç
        weaknesses
        egg
      }
    }
  `)
  function navigatePrev() {
    navigate(_.padStart(parseInt(pokemon.num) - 1, 3, '0'))
  }
  function navigateNext() {
    navigate(_.padStart(parseInt(pokemon.num) + 1, 3, '0'))
  }

  if (loading)
    return (
      <S.Container>
        <p>Loading...</p>
      </S.Container>
    )
  if (error)
    return (
      <S.Container>
        <p>Error :(</p>
      </S.Container>
    )
  const pokemon = data.pokemonOne
  return (
    <S.Container>
      <S.Link to="/">Back</S.Link>
      <IconButton
        onClick={navigatePrev}
        style={{ visibility: pokemon.num === '001' ? 'hidden' : 'visible' }}
      >
        <NavigateBeforeIcon fontSize="large" />
      </IconButton>
      <PokemonCard pokemon={pokemon} />
      <IconButton
        onClick={navigateNext}
        style={{ visibility: pokemon.num === '151' ? 'hidden' : 'visible' }}
      >
        <NavigateNextIcon fontSize="large" />
      </IconButton>
    </S.Container>
  )
}
