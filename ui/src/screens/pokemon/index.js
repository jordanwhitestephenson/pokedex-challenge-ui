import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { navigate } from '@reach/router'
import { IconButton } from '@material-ui/core'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import _ from 'lodash'

import PokemonCard from '../../components/PokemonCard'
import * as S from './styled'

export default function PokemonScreen({ num }) {
   //replace the first padded 0's rather than all of them
  //  prev pokemonOne(id: ${num.replace(/0/g, '')})

  const { loading, error, data } = useQuery(gql`
    {
      pokemonOne(id: ${num.replace(/^0+/g, '')}) {
        num
        name
        img
        weight
        height
        type
        weaknesses
        egg
      }
    }
  `)



  const pokemon = data.pokemonOne


  function navigatePrev() {
    // navigate(_.padStart(parseInt(pokemon.num) - 1, 3, '0'))
    navigate(_.padStart(parseInt(pokemon.num) - 1, 3, '0'))
  }
  function navigateNext() {
    // navigate(_.padStart(parseInt(pokemon.num) + 1, 3, '0'))
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
