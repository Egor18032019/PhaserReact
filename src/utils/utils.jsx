import React from 'react';

// компонент пользовательского выпадающего списка
const customLi = (dataGameList, onClickGame) => {

  return (<ul className="Game-list" > {
    dataGameList.map((game) => {
      const onGame = ()=> {
        onClickGame(game.name);
      };
      return (
        <li className="Game-item"
          id={
            game.id
          }
          onClick={
            onGame
          }
          key={
            game.id
          }
          style={{
            backgroundImage: `url(${game.img})`
          }}>
          <span> {game.name} </span>
        </li>
      );
    })
  }

  </ul>
  );
};


// компонент пользовательского выпадающего списка
const customSelect = ({id, options, onChange}) => {
  return (
    <select className="custom-select" id={id} onChange={onChange}>
      { options.map((option, index) =>
        <option key={id + index} value={option.id}>{option.name}</option>
      )}
    </select>
  );
};

export {
  customSelect, customLi
};
