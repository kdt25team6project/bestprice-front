import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import axios from 'axios';
import './style.css';
import SearchResultsPage from '../Search';
import { userState } from '../../state/userState';
import { useRecoilValue } from 'recoil';
import { checkBookmark, toggleBookmark } from '../Search/Bookmark';
import { checkRecommendation, toggleRecommend } from '../Search/Recommend';

// 제거할 접두사
const prefixesToRemove = ['통', '송송', '썬', '썬 것', '볶음', '생', '다진', '신', '슬라이스', '다진것', '다진 것', '유기농', '뜨거운', '찬', '차가운'];

// 제거할 접미사
const suffixesToRemove = ['썬', '썬 것', '볶음', '생', '다진', '신', '슬라이스', '다진것', '다진 것', '유기농', '뜨거운', '찬', '차가운'];

// 처리할 동의어
const synonymMap = {
  '달걀': '계란',
  '베이킹소다': '중조',
  '무뼈': '뼈없는',
  '새우살': '새우',
  '물': ['온수', '생수', '얼음물', '찬물', '얼음'],
  '육수': '국물용'
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

  // 동의어 처리
  if (synonymMap[normalizedTerm]) {
    if (Array.isArray(synonymMap[normalizedTerm])) {
      normalizedTerm = synonymMap[normalizedTerm][0];
    } else if (typeof synonymMap[normalizedTerm] === 'string') {
      normalizedTerm = synonymMap[normalizedTerm];
    }
  }

  return normalizedTerm.replace(/\s+/g, '_');
};

// 검색
const findIngredient = (name, data) => {
  const normalizedName = normalizeSearchTerm(name);
  const fusePrimary = new Fuse(data, {
    keys: ['식품명'],
    // 정확도
    threshold: 0.3,
    includeScore: true
  });
  let result = fusePrimary.search(normalizedName);
  return result.length > 0 ? result[0].item : null;
};

// 재료 이름 | 양
const parseQuantity = (quantity) => {
  const firstDigitIndex = quantity.search(/\d/);
  let name, amount;

  if (firstDigitIndex !== -1) {
    name = quantity.slice(0, firstDigitIndex).trim();
    amount = quantity.slice(firstDigitIndex).trim();
  } else {
    const firstSpaceIndex = quantity.indexOf(' ');
    if (firstSpaceIndex !== -1) {
      name = quantity.slice(0, firstSpaceIndex).trim();
      amount = quantity.slice(firstSpaceIndex + 1).trim();
    } else {
      name = quantity.trim();
      amount = '';
    }
  }

  return { name, amount };
};

// 재료 카테고리 | 이름
const parseIngredients = (ingredientText) => {
  if (!ingredientText) {
    return [];
  }
  
  const sections = ingredientText.split(/\[(.*?)\]/).filter(Boolean);
  const ingredients = [];
  let currentSectionName = ''; 

  sections.forEach((section, index) => {
    if (index % 2 === 0) {
      currentSectionName = section.trim(); 
    } else {
      const itemList = section.split('|').map((item) => item.trim());
      itemList.forEach((item) => {
        const { name, amount } = parseQuantity(item);
        ingredients.push({ sectionName: currentSectionName, name, amount });
      });
    }
  });

  return ingredients;
};


// 단위 변경
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

function RecipeDetailPage() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [result, setResult] = useState(null);
  const [appliedIngredients, setAppliedIngredients] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [isRecommended, setIsRecommended] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useRecoilValue(userState);
  const userId = user?.userId;

  useEffect(() => {
    if (recipe && nutritionData.length > 0) {
      calculateNutrition();
    }
  }, [recipe, nutritionData]);

    // 추천 및 찜 상태 확인
    useEffect(() => {
      if (recipeId && userId) {
        (async () => {
          try {
            const [recommendation, bookmark] = await Promise.all([
              checkRecommendation(recipeId, userId),
              checkBookmark(recipeId, userId),
            ]);
            setIsRecommended(recommendation);
            setIsBookmarked(bookmark);
          } catch (error) {
            console.error("추천 및 찜 상태 확인 실패:", error);
          }
        })();
      }
    }, [recipeId, userId]);
  
    // 추천 상태 토글
    const handleToggleRecommend = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const newRecommendState = await toggleRecommend(recipeId, userId, isRecommended);
        setIsRecommended(newRecommendState);
      } catch (error) {
        console.error("추천 상태 변경 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    // 찜 상태 토글
    const handleToggleBookmark = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const newBookmarkState = await toggleBookmark(recipeId, userId, isBookmarked);
        setIsBookmarked(newBookmarkState);
      } catch (error) {
        console.error("찜 상태 변경 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };


  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setLoading(true);
  
        const recipeDetailResponse = await axios.get(`http://localhost:8001/api/recipe/${recipeId}`);
        const recipeExtraResponse = await axios.get(`http://localhost:8001/recipe?query=${recipeId}`);
  
        // 데이터 병합
        const mergedData = {
          ...recipeDetailResponse.data, // 첫 번째 API 데이터
          mainThumb: recipeExtraResponse.data.mainThumb, // 두 번째 API의 mainThumb
          steps: recipeExtraResponse.data.steps, // 두 번째 API의 steps
        };
  
        console.log("Merged Data:", mergedData);
  
        setRecipe(mergedData); // 병합된 데이터 저장
  
        // CKG_MTRL_CN 데이터를 파싱하여 재료 목록 저장
        if (mergedData.ckg_MTRL_CN) {
          const ingredients = parseIngredients(mergedData.ckg_MTRL_CN); // 파싱 함수 호출
          setIngredientsList(ingredients); // 상태로 저장
        }
  
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipe data:', err);
        setLoading(false);
      }
    };
  
    fetchRecipeData();
  }, [recipeId]);
  

  // 영양 데이터
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
  

  const extractAmountAndUnit = (amount) => {
    const fractionMatch = amount.match(/(\d+)\/(\d+)([a-z가-힣]*)/i);
    const decimalMatch = amount.match(/(\d+(\.\d+)?)([a-z가-힣]*)/i);
  
    if (fractionMatch) {
      // 분수 형식일 경우 분수를 소수로 변환
      const numericAmount = parseFloat(fractionMatch[1]) / parseFloat(fractionMatch[2]);
      return { amount: numericAmount, unit: fractionMatch[3].trim() };
    } else if (decimalMatch) {
      // 정수 또는 소수일 경우 그대로 사용
      return { amount: parseFloat(decimalMatch[1]), unit: decimalMatch[3].trim() };
    }
  
    // 양이 명시되지 않은 경우 기본값을 반환
    return { amount: 1, unit: '' };
  };
  
  // calculateNutrition 함수 내에서 extractAmountAndUnit을 적용
  const calculateNutrition = () => {
    if (ingredientsList.length === 0 || nutritionData.length === 0) return;
  
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
  
    ingredientsList.forEach((ingredient) => {
      const { name, amount } = ingredient;
      const parsedQuantity = extractAmountAndUnit(amount || '1개');
      const found = findIngredient(name, nutritionData);
  
      if (found) {
        const grams = unitToGrams(parsedQuantity.amount, parsedQuantity.unit);
        totalNutrition.calories += ((found['에너지(kcal)'] || 0) / 100) * grams;
        totalNutrition.protein += ((found['단백질(g)'] || 0) / 100) * grams;
        totalNutrition.carbs += ((found['탄수화물(g)'] || 0) / 100) * grams;
        totalNutrition.fat += ((found['지방(g)'] || 0) / 100) * grams;
        totalNutrition.fiber += ((found['식이섬유(g)'] || 0) / 100) * grams;
        totalNutrition.calcium += ((found['칼슘(mg)'] || 0) / 100) * grams;
        totalNutrition.sodium += ((found['나트륨(mg)'] || 0) / 100) * grams;
        totalNutrition.vitaminC += ((found['비타민 C(mg)'] || 0) / 100) * grams;
  
        calculatedIngredients.push({ usedName: name, matchedName: found['식품명'] });
      }
    });
    setResult(totalNutrition);
    setAppliedIngredients(calculatedIngredients);
  };
  

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return;

  const groupedIngredients = ingredientsList.reduce((acc, item) => {
    if (!acc[item.sectionName]) acc[item.sectionName] = [];
    acc[item.sectionName].push(item);
    return acc;
  }, {});
  

  return (
    <div className="recipe-container">
      <div className="recipe-image">
        <img src={recipe.mainThumb} alt={recipe.rcp_TTL} />
        <div className="button-group">
            <button
              className="buttons1"
              onClick={handleToggleRecommend}
              disabled={isLoading}
            >
              {isRecommended ? "추천 취소" : "추천하기"}
            </button>

            <button
              className="buttons2"
              onClick={handleToggleBookmark}
              disabled={isLoading}
            >
              {isBookmarked ? "찜 해제" : "찜하기"}
            </button>
          </div>
      </div>

      <div className="recipe-header">
        <div className="recipeD-title">{recipe.rcp_TTL}</div>
        <div className="recipeD-summary">{recipe.ckg_IPDC}</div>
        <div className="recipeD-info">
          <span>
            <img src="/images/icon_person.png" alt="인분" /> {recipe.ckg_INBUN_NM}
          </span>
          <span>
            <img src="/images/icon_time.png" alt="시간" /> {recipe.ckg_TIME_NM}
          </span>
          <span>
            <img src="/images/icon_level.png" alt="난이도" /> {recipe.ckg_DODF_NM}
          </span>
        </div>
      </div>

      <div className="recipeD-box">
        <dl className="recipe-ingredients">
          {ingredientsList.length === 0 ? (
            <p>재료 정보가 없습니다.</p>
          ) : (
            Object.entries(groupedIngredients).map(([section, items]) => (
              <React.Fragment key={section}>
                <dt><span>{section}</span></dt>
                <dd>
                  <ul className="ingredient-list">
                    {items.map((item, index) => (
                      <li key={index}>
                        <div className="ingredient-list_1">
                          <div className="ingredient-name">{item.name || "재료 이름 없음"}</div>
                          <span className="ingredient-amount">{item.amount || "양 없음"}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </React.Fragment>
            ))
          )}
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
          {recipe.steps.map((step, index) => (
            <li key={index}>
              <div className="step_list_num">
                <span>STEP</span> {index + 1} <span>/ {recipe.steps.length}</span>
              </div>
              <div className="step_list_txt">
                <div className="step_list_txt_cont">{step.stepText}</div>
              </div>
              <div className="step_list_txt_pic">
                {step.stepsImg && <img src={step.stepsImg} alt={`Step ${index + 1}`} />}
              </div>
            </li>
          ))}
        </ul>
      <SearchResultsPage/>
    </div>
  );
}

export default RecipeDetailPage;