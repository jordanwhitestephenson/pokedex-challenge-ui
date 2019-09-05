import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import _ from 'lodash'
import "react-dropdown/style.css";
import SearchBox from '../../components/SearchBox'
import PokemonCard from '../../components/PokemonCard'
import * as S from './styled'
import Dropdown from "react-dropdown";
export default function HomeScreen() {
  const [dropdownValue, updateDropdownValue] = useState()
  const { loading, error, data } = useQuery(gql`
    {
      pokemonMany {
        name
        num
        img
        type
        weaknesses
      }
    }
  `)
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
  const handledropDown = (value) => {
    updateDropdownValue(value)
  }
  const options = [
    { value: "Poison", label: "Poison" },
    { value: "Water", label: "Water" },
    { value: "Grass", label: "Grass" },
    { value: "Fighting", label: "Fighting" },
    { value: "Psychic", label: "Psychic" }
  ];

  return (
    <S.Container>
      <h1>Pokédex</h1>
      <Dropdown options={options} value={dropdownValue} onChange={(e) => handledropDown(e.value)}></Dropdown>

      <SearchBox
        suggestions={data.pokemonMany.map(pokemon => ({
          label: pokemon.name,
          value: pokemon.num,
          type : pokemon.type
        }))}
      >
        {searchValue => (
          <S.Grid>
            {data.pokemonMany
              .filter(pokemon =>
                searchValue
                  ? _.deburr(pokemon.name.toLowerCase()).includes(
                    _.deburr(searchValue.toLowerCase())
                  )
                  : true
              )
              
              .filter(pokemon =>
                dropdownValue ?
                pokemon.type.includes(dropdownValue)
                : true
              )
              .map(pokemon => (
                <S.CardContainer key={pokemon.num}>
                  <S.CardLink to={`/${pokemon.num}`}>
                    <PokemonCard
                      key={pokemon.num}
                      pokemon={pokemon}
                      isSmall
                      animateHovering
                    />
                  </S.CardLink>
                </S.CardContainer>
              ))}
          </S.Grid>
        )}
      </SearchBox>
    </S.Container>
  )
}
