import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import './RecipeDetailPage.css';

const prefixesToRemove = ['통', '송송', '썬', '썬 것', '볶음', '생', '다진', '신', '슬라이스', '다진것', '다진 것', '유기농', '뜨거운', '찬', '차가운'];
const suffixesToRemove = ['썬', '썬 것', '볶음', '생', '다진', '신', '슬라이스', '다진것', '다진 것', '유기농', '뜨거운', '찬', '차가운'];

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

  prefixesToRemove.forEach(prefix => {
    if (normalizedTerm.startsWith(prefix)) {
      normalizedTerm = normalizedTerm.slice(prefix.length);
    }
  });

  suffixesToRemove.forEach(suffix => {
    if (normalizedTerm.endsWith(suffix)) {
      normalizedTerm = normalizedTerm.slice(0, -suffix.length);
    }
  });

  if (synonymMap[normalizedTerm]) {
    if (Array.isArray(synonymMap[normalizedTerm])) {
      normalizedTerm = synonymMap[normalizedTerm][0];
    } else if (typeof synonymMap[normalizedTerm] === 'string') {
      normalizedTerm = synonymMap[normalizedTerm];
    }
  }

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
  return result.length > 0 ? result[0].item : null;
};

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

  useEffect(() => {
    if (recipe && nutritionData.length > 0) {
      calculateNutrition();
    }
  }, [recipe, nutritionData]);

  useEffect(() => {
    setLoading(true);

    const mockData = {
      rcpSno: 139247,
      title: "부들부들 보들보들 북어갈비♥",
      ckgNm: "북어갈비",
      rgtrId: "skfo0701",
      rgtrNm: "꽃날",
      inqCnt: 7173,
      rcmmCnt: 3,
      srapCnt: 97,
      category1: "굽기",
      category2: "술안주",
      category3: "건어물류",
      category4: "메인반찬",
      description: "오늘은 집에서 굴러다니고 쉽게 구할 수 있는 북어로 일품요리를 만들어 보았어요! 도시락 반찬으로는 물론 초대요리에도 너무너무 좋은 요리랍니다~ 겉에 찹쌀가루를 묻혀서 맛도 고소해요~",
      servings: "2인분",
      difficulty: "초급",
      timeRequired: "60분이내",
      mainThumb: "https://recipe1.ezmember.co.kr/cache/recipe/2015/09/02/1aacaa404802b996c5c4204f876f08871.jpg",
      firstRegDt: "2007-05-01T00:08:44",
      CKG_MTRL_CN: "[재료] 북어포 1마리| 찹쌀가루 1C [양념] 간장 2T| 설탕 1T| 물 1T| 다진파 1T| 다진마늘 1T| 참기름 1T| 깨소금 1T| 후춧가루 약간",
      steps: [
        {
          stepId: 28,
          step: "북어포를 준비해주세여.머리랑 꼬리는 잘라주시고 지느러미도 정리해주세요.그리고 등쪽에 껍질도 제거해주세요.그 다음 물에 5분~10분정도만 불려주세요.",
          stepOrder: 1,
          stepImg: null
        },
        {
          stepId: 29,
          step: "북어를 불리는 동안 위의 분량대로 넣어서 양념장을 만들어 주세요.",
          stepOrder: 2,
          stepImg: null
        },
        {
          stepId: 30,
          step: "불린 북어를 한번 꾹꾹 눌러서 물기를 짜 준 다음에키친타올에 올려 물기를 한번 더 제거해주세요.",
          stepOrder: 3,
          stepImg: "https://recipe1.ezmember.co.kr/cache/recipe/2016/08/16/4ccfd429992590b4bb66ebc463af59c21.jpg"
        },
        {
          stepId: 31,
          step: "칼코를 이용해 북어 등쪽에 칼집을 콕콕콕 내주세요.",
          stepOrder: 4,
          stepImg: null
        },
        {
          stepId: 32,
          step: "먹기 좋은 크기로 잘라주세요.저는 일단 반으로 자른뒤 5등분 해줬어요~",
          stepOrder: 5,
          stepImg: null
        },
        {
          stepId: 33,
          step: "그 다음 통에 북어를 깔고 양념장 1t씩 북어살 안쪽에 뿌려주세요.",
          stepOrder: 6,
          stepImg: null
        },
        {
          stepId: 34,
          step: "북어->양념장->북어->양념장 순서대로 올려주세요.북어 크기에 따라 양념장이 남을수도 있고 안 남을수도 있지만남은 양념장은 과감히 버려주세요~이렇게 한 뒤 1시간정도 숙성시켜주세요.",
          stepOrder: 7,
          stepImg: null
        },
        {
          stepId: 35,
          step: "1시간 뒤에 간이 적절히 밴 북어를 찹쌀가루에 묻혀주세요.남은 찹쌀가루는 톡톡톡 털어주세요~",
          stepOrder: 8,
          stepImg: "https://recipe1.ezmember.co.kr/cache/recipe/2016/08/16/408e961023eb839989c66aa2324d357a1.jpg"
        },
        {
          stepId: 36,
          step: "달군 후라이팬에 기름을 넉넉히 두르고 찹쌀가루를 묻히 북어를 익혀주세요. (약간 튀긴듯한 느낌으로요)",
          stepOrder: 9,
          stepImg: null
        },
        {
          stepId: 37,
          step: "잘 구워준 북어갈비를 키친타올에 올려 불필요한 기름을 제거해주시면 완성!!!!!!!!!!",
          stepOrder: 10,
          stepImg: "https://recipe1.ezmember.co.kr/cache/recipe/2016/08/16/2cecab6c4d9b2b7b9097078ebe96b5901.jpg"
        }
      ]
    };

    setRecipe(mockData);
    setLoading(false);
  
    if (mockData.CKG_MTRL_CN) {  
      const ingredients = parseIngredients(mockData.CKG_MTRL_CN);
      setIngredientsList(ingredients);  
    }
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
        <img src={recipe.mainThumb} alt={recipe.title} />
      </div>

      <div className="recipe-header">
        <div className="recipeD-title">{recipe.title}</div>
        <div className="recipeD-summary">{recipe.description}</div>
        <div className="recipeD-info">
          <span>
            <img src="/images/icon_person.png" alt="인분" /> {recipe.servings}
          </span>
          <span>
            <img src="/images/icon_time.png" alt="시간" /> {recipe.timeRequired}
          </span>
          <span>
            <img src="/images/icon_time.png" alt="난이도" /> {recipe.difficulty}
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
                {items.map((item, index) => (
                  <li key={index}>
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

export default RecipeDetailPage;