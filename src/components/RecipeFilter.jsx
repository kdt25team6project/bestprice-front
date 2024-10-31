import React from 'react';

function RecipeFilter({ onFilterChange }) {
  const categories = [
    { type: 'cat4', label: '종류별', options: [{ id: '', name: '전체' }, { id: '63', name: '밑반찬' }, /* ...다른 옵션 */] },
    { type: 'cat3', label: '재료별', options: [{ id: '', name: '전체' }, { id: '70', name: '소고기' }, /* ...다른 옵션 */] },
    { type: 'cat1', label: '방법별', options: [{ id: '', name: '전체' }, { id: '6', name: '볶음' }, /* ...다른 옵션 */] },
  ];

  const handleFilterClick = (type, id) => {
    onFilterChange(type, id);
  };

  return (
    <div className="filter-container">
      {categories.map((category) => (
        <div key={category.type}>
          <h3>{category.label}</h3>
          {category.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleFilterClick(category.type, option.id)}
              className="filter-button"
            >
              {option.name}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default RecipeFilter;
