import React, { useState } from "react";
import Downshift from "downshift";
import { Paper, Popper } from "@material-ui/core";
import _ from "lodash";
import { navigate } from "@reach/router";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

import * as S from "./styled";
//how are we only getting value and label for the cards
function renderInput(inputProps) {
  const { InputProps, ref, ...other } = inputProps;
  return (
    <S.Input
      InputProps={{
        inputRef: ref,
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderDropDown(inputProps) {
  console.log(inputProps, 'inpiut')
  const options = [
    { value: "Poison", label: "Poison" },
    { value: "Water", label: "Water" },
    { value: "Grass", label: "Grass" },
    { value: "Fighting", label: "Fighting" },
    { value: "Psychic", label: "Psychic" }
  ];
  const defaultOption = options[0];
  const { InputProps, onChange, ref, suggestions, ...other  } = inputProps;
  return (
    <Dropdown
      options={options}
      InputProps={{
        inputRef: ref,
        ...InputProps
      }}
      {...other}
      // onChange={e => getSuggestions(e.value, {})}
      value={defaultOption}
      placeholder="Select an option"
    />
  );
}

function renderSuggestion(suggestionProps) {
  console.log(suggestionProps, 'in Render')
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;

  if (isSelected) {
    navigate(`/${suggestion.value}`);
  } else {
    return (
      <S.MenuItem
        {...itemProps}
        key={suggestion.label}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
      >
        {suggestion.label}
      </S.MenuItem>
    );
  }
}

function getSuggestions(value, { showEmpty = false } = {}, suggestions) {
  
  const inputValue = _.deburr(value.trim()).toLowerCase();

  if (inputValue.length < 2 && !showEmpty) {
    return [];
  }
  return suggestions.filter(suggestion => {
    const suggestionLabel = _.deburr(suggestion.label.trim()).toLowerCase();
    const suggestionType = _.deburr(suggestion.type.map(item => item.trim().toLowerCase()))
    console.log(suggestionLabel.includes(inputValue), 'YA')
    return suggestionType.includes(inputValue) || suggestionLabel.includes(inputValue)
  });
}

let popperNode;

export default function Filter({ suggestions, children }) {
  const [value, setValue] = useState("");


  function stateReducer(state, changes) {
    console.log(changes, "TYPE");
    switch (changes.type) {
      case Downshift.stateChangeTypes.changeInput:
        console.log(changes, "changes");
        setValue(changes.inputValue);
        return changes;
      default:
        return changes;
    }
  }

  return (
    <Downshift inputValue={value} stateReducer={stateReducer}   onChange={selection => console.log(
      selection ? `You selected ${selection.value}` : 'Selection Cleared'
    )}>
      {({
        getInputProps,
        selectedItem,
        getItemProps,
        getLabelProps,
        isOpen,
        getMenuProps,
        highlightedIndex,
        inputValue,
      }) => {
        console.log(inputValue)
        const { onBlur, onFocus, onChange, ...inputProps } = getInputProps({
          placeholder: "Search Pokémon..."
        })

        return (
          <div>
            <div>
              {renderInput({
                fullWidth: true,
                InputProps: { onBlur, onFocus },
                InputLabelProps: getLabelProps({ shrink: true }),
                inputProps,
                ref: node => {
                  popperNode = node;
                }
              })}
              {renderDropDown({
                fullWidth: true,
                suggestions: suggestions,
                InputProps: { onChange },
                InputLabelProps: getLabelProps({ shrink: true }),
                inputProps,
                ref: node => {
                  popperNode = node;
                }
              })}

              <Popper open={isOpen} anchorEl={popperNode}>
                <div
                  {...(isOpen
                    ? getMenuProps({}, { suppressRefError: true })
                    : {})}
                >
                  <Paper
                    square
                    style={{
                      marginTop: 8,
                      width: popperNode ? popperNode.clientWidth : undefined
                    }}
                  >
                    {getSuggestions(inputValue, {}, suggestions).map(
                      (suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: getItemProps({
                            item: suggestion.label
                          }),
                          highlightedIndex,
                          selectedItem
                        })
                    )}
                  </Paper>
                </div>
              </Popper>
            </div>
            {children(inputValue)}
          </div>
        );
      }}
    </Downshift>
  );
}