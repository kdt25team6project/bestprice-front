import React from 'react';

function RecipeFilter({ onFilterChange }) {
  const categories = [
    { 
      type: 'cat4', 
      label: '종류별', 
      options: [
        { id: '', name: '전체' }, 
        { id: '63', name: '밑반찬' }, 
        { id: '56', name: '메인반찬' },
        { id: '54', name: '국/탕' },
        { id: '55', name: '찌개' },
        { id: '60', name: '디저트' },
        { id: '53', name: '면/만두' },
        { id: '52', name: '밥/죽/떡' },
        { id: '61', name: '퓨전' },
        { id: '57', name: '김치/젓갈/장류' },
        { id: '58', name: '양념/소스/잼' },
        { id: '65', name: '양식' },
        { id: '64', name: '샐러드' },
        { id: '68', name: '스프' },
        { id: '66', name: '빵' },
        { id: '69', name: '과자' },
        { id: '59', name: '차/음료/술' },
        { id: '62', name: '기타' }
      ] 
    },
    { 
      type: 'cat3', 
      label: '재료별', 
      options: [
        { id: '', name: '전체' }, 
        { id: '70', name: '소고기' }, 
        { id: '71', name: '돼지고기' },
        { id: '72', name: '닭고기' },
        { id: '23', name: '육류' },
        { id: '28', name: '채소류' },
        { id: '24', name: '해물류' },
        { id: '50', name: '달걀/유제품' },
        { id: '33', name: '가공식품류' },
        { id: '47', name: '쌀' },
        { id: '32', name: '밀가루' },
        { id: '25', name: '건어물류' },
        { id: '31', name: '버섯류' },
        { id: '48', name: '과일류' },
        { id: '27', name: '콩/견과류' },
        { id: '26', name: '곡류' },
        { id: '34', name: '기타' }
      ] 
    },
    { 
      type: 'cat1', 
      label: '방법별', 
      options: [
        { id: '', name: '전체' }, 
        { id: '6', name: '볶음' }, 
        { id: '1', name: '끓이기' },
        { id: '7', name: '부침' },
        { id: '36', name: '조림' },
        { id: '41', name: '무침' },
        { id: '42', name: '비빔' },
        { id: '8', name: '찜' },
        { id: '10', name: '절임' },
        { id: '9', name: '튀김' },
        { id: '38', name: '삶기' },
        { id: '67', name: '굽기' },
        { id: '39', name: '데치기' },
        { id: '37', name: '회' },
        { id: '11', name: '기타' }
      ] 
    }
  ];

  return (
    <div>
      {categories.map(category => (
        <div key={category.type}>
          <label>{category.label}</label>
          <select onChange={(e) => onFilterChange(category.type, e.target.value)}>
            {category.options.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}


export default RecipeFilter;
