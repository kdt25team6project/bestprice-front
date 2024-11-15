import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Fuse from 'fuse.js';
import './RecipeDetailPage.css';

const prefixesToRemove = ['통', '송송','썬','썬 것','볶음','생','다진',  '신', '슬라이스', '다진것','다진 것','유기농','뜨거운','찬','차가운'];
const suffixesToRemove = ['썬','썬 것','볶음','생','다진',  '신', '슬라이스', '다진것','다진 것','유기농','뜨거운','찬','차가운']; 

const synonymMap = {
  '달걀':'계란',
  '베이킹소다':'중조',
  '무뼈': '뼈없는',
  '새우살' : '새우',
  '물':['온수','생수','얼음물','찬물','얼음'],
  '육수':'국물용'
};

const normalizeSearchTerm = (term) => {
  let normalizedTerm = typeof term === 'string' ? term.trim().toLowerCase() : '';

  // 접두사 제거
  prefixesToRemove.forEach(prefix => {
    if (normalizedTerm.startsWith(prefix)) {
      normalizedTerm = normalizedTerm.slice(prefix.length);
    }
  });

  // 접미사 제거
  suffixesToRemove.forEach(suffix => {
    if (normalizedTerm.endsWith(suffix)) {
      normalizedTerm = normalizedTerm.slice(0, -suffix.length);
    }
  });

  // 동의어 맵에서 매칭되는 기본 이름으로 치환
  if (synonymMap[normalizedTerm]) {
    if (Array.isArray(synonymMap[normalizedTerm])) {
      normalizedTerm = synonymMap[normalizedTerm][0];
    } else if (typeof synonymMap[normalizedTerm] === 'string') {
      normalizedTerm = synonymMap[normalizedTerm];
    }
  }

  // 공백을 '_'로 치환하여 반환
  return normalizedTerm.replace(/\s+/g, '_');
};


const findIngredient = (name, data) => {
  const normalizedName = normalizeSearchTerm(name);

  const fusePrimary = new Fuse(data, {
    keys: ['식품명'], 
    threshold: 0.3,
    includeScore: true 
  });

  let result = fusePrimary.search(normalizedName);

  // 가장 유사한 결과 반환
  return result.length > 0 ? result[0].item : null;
};

const parseQuantity = (quantity) => {
  // 정수, 소수, 분수 형식을 인식
  const fractionMatch = quantity.match(/(\d+)\/(\d+)([a-z가-힣]*)/i);
  const decimalMatch = quantity.match(/(\d+(\.\d+)?)([a-z가-힣]*)/i);

  if (fractionMatch) {
    // 분수일 경우 분자를 분모로 나누어 소수로 변환
    const amount = parseFloat(fractionMatch[1]) / parseFloat(fractionMatch[2]);
    return { amount, unit: fractionMatch[3] };
  } else if (decimalMatch) {
    // 소수나 정수일 경우 그대로 사용
    return { amount: parseFloat(decimalMatch[1]), unit: decimalMatch[3] };
  }
  
  // 양이 주어지지 않은 경우 기본값으로 1 반환
  return { amount: 1, unit: '' };
};

const conversionTable = {
  '': 50,
  'C': 240,  
  '스푼': 15,
  '큰술': 15,
  'T': 15,
  '작은술': 5,
  't': 5,    
  '개': 20, 
  '알': 50,
  '공기': 200,
  '마리': 100,
  'g': 1,
  'kg': 1000, 
  '모': 200,
  '조금': 5,
  '약간': 5,
};

const unitToGrams = (amount, unit, density = 1) => {
  if (unit === 'ml') {
    return amount * density;
  }
  return amount * (conversionTable[unit] || 1); 
};

function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error] = useState(null);
  const [result, setResult] = useState(null);
  const [appliedIngredients, setAppliedIngredients] = useState([]);

  useEffect(() => {
    if (recipe && nutritionData.length > 0) {
      calculateNutrition(); // 영양 성분 자동 계산
    }
  }, [recipe, nutritionData]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8001/api/recipes/${recipeId}`)
      .then((response) => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false); 
      });
  }, [recipeId]);
  
  useEffect(() => {
    setLoading(true);
    fetch('/nutrition_data.json')
      .then((response) => response.json())
      .then((data) => {
        setNutritionData(data.records || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('영양 데이터 로드 실패:', error);
        setLoading(false); 
      });
  }, []);
  
  if (loading) return <p>로딩 중...</p>; 
  if (error) return <p>{error}</p>;
  if (!recipe) return;

  const groupedIngredients = recipe.ingredientsList.reduce((acc, item) => {
    if (!acc[item.sectionName]) acc[item.sectionName] = [];
    acc[item.sectionName].push(item);
    return acc;
  }, {});

  const calculateNutrition = () => {
    if (!recipe) return;

    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,        
      calcium: 0,      
      sodium: 0,       
      vitaminC: 0,     
    };
    let calculatedIngredients = [];

    recipe.ingredientsList.forEach((ingredient) => {
      const { name, amount } = ingredient;
      const parsedQuantity = parseQuantity(amount || '1개');
      const found = findIngredient(name, nutritionData);

      if (found) {
        const grams = unitToGrams(parsedQuantity.amount, parsedQuantity.unit);
        totalNutrition.calories += (found['에너지(kcal)'] / 100) * grams;
        totalNutrition.protein += (found['단백질(g)'] / 100) * grams;
        totalNutrition.carbs += (found['탄수화물(g)'] / 100) * grams;
        totalNutrition.fat += (found['지방(g)'] / 100) * grams;
        totalNutrition.fiber += (found['식이섬유(g)'] / 100) * grams;
        totalNutrition.calcium += (found['칼슘(mg)'] / 100) * grams;
        totalNutrition.sodium += (found['나트륨(mg)'] / 100) * grams;
        totalNutrition.vitaminC += (found['비타민 C(mg)'] / 100) * grams;
        totalNutrition.saturatedFat += (found['포화지방산(g)'] / 100) * grams;

        calculatedIngredients.push({ usedName: name, matchedName: found['식품명'] });
      }
    });
    setResult(totalNutrition);
    setAppliedIngredients(calculatedIngredients);
  };

  return (
    <div className="recipe-container">
      <div className="recipe-image">
        <img src={recipe.mainThumb} alt={recipe.title} />
      </div>

      <div className="recipe-header">
        <div className="recipeD-title">{recipe.title}</div>
        <div className="recipeD-summary">{recipe.description}</div>
        <div className="recipeD-info">
          <span>
            <img src="/icon_person.png" alt="인분" /> {recipe.servings}
          </span>
          <span>
            <img src="/icon_time.png" alt="시간" /> {recipe.timeRequired}
          </span>
          <span>
            <img src="/icon_level.png" alt="난이도" /> {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="recipeD-box">
        <dl className="recipe-ingredients">
          {Object.entries(groupedIngredients).map(([section, items]) => (
            <React.Fragment key={section}>
              <dt><span>{section}</span></dt>
              <dd>
                <ul className="ingredient-list">
                  {items.map((item) => (
                    <li key={item.id}>
                      <div className="ingredient-list_1">
                        <div className="ingredient-name">{item.name}</div>
                        <span className="ingredient-amount">{item.amount}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </React.Fragment>
          ))}
        </dl>
        {result && (
          <dl className="recipe-ingredients">
            <dt><span>영양성분</span></dt>
            <dd>
              <ul className="ingredient-list">
                <li>
                  <div className="ingredient-list_1">
                    <div className="ingredient-name">칼로리</div>
                    <span className="ingredient-amount">{result.calories.toFixed(2)} 
                      <span>kcal</span>
                    </span>
                  </div>
                </li>
                <li>
                  <div className="ingredient-list_1">
                    <div className="ingredient-name">단백질</div>
                    <span className="ingredient-amount">{result.protein.toFixed(2)} 
                      <span>g</span>
                    </span>
                  </div>
                </li>
                <li>
                  <div className="ingredient-list_1">
                    <div className="ingredient-name">탄수화물</div>
                    <span className="ingredient-amount">{result.carbs.toFixed(2)} 
                      <span>g</span>
                    </span>
                  </div>
                </li>
                <li>
                  <div className="ingredient-list_1">
                    <div className="ingredient-name">지방</div>
                    <span className="ingredient-amount">{result.fat.toFixed(2)}
                      <span>g</span>
                    </span>
                  </div>
                </li>
                <li>
                  <div className="ingredient-list_1">
                    <div className="ingredient-name">식이섬유</div>
                    <span className="ingredient-amount">{result.fiber.toFixed(2)}
                      <span>g</span>
                    </span>
                  </div>
                </li>
                <li>
                  <div className="ingredient-list_1">
                    <div className="ingredient-name">칼슘</div>
                    <span className="ingredient-amount">{result.calcium.toFixed(2)}
                      <span>g</span>
                    </span>
                  </div>
                </li>
                <li>
                  <div className="ingredient-list_1">
                    <div className="ingredient-name">나트륨</div>
                    <span className="ingredient-amount">{result.sodium.toFixed(2)}
                      <span>g</span>
                    </span>
                  </div>
                </li>
              </ul>
            </dd>
          </dl>
        )}
      </div>

      <div className="view3_box_tit">조리 순서</div>
        <ul className="step_list st_thumb">
          {recipe.steps.map((step) => (
            <li key={step.step}>
              <div className="step_list_num">
                <span>STEP</span> {step.stepOrder} <span>/ {recipe.steps.length}</span>
              </div>
              <div className="step_list_txt">
                <div className="step_list_txt_cont">{step.step}</div>
              </div>
              <div className="step_list_txt_pic">
                {step.stepImg && (
                  <img src={step.stepImg} alt="" />
                )}
              </div>
            </li>
          ))}
        </ul>
    </div>
  );
}


export default RecipeDetail;
