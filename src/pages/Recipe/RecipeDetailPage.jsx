import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import './RecipeDetailPage.css';

const RecipeDetailPage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/recipes.csv');
      const text = await response.text();
      const results = Papa.parse(text, { header: true });
      setCsvData(results.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRecipe = () => {
      const recipeDetail = csvData.find(item => item.RCP_SNO === String(recipeId));
      setRecipe(recipeDetail);
    };

    if (csvData.length > 0) {
      fetchRecipe();
    }
  }, [csvData, recipeId]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-detail-container">
      <img 
        src={`/images/${recipe.RCP_TTL}.jpg`} 
        alt={recipe.RCP_TTL} 
        className="recipe-detail-image" 
      />
      <h1>{recipe.RCP_TTL}</h1>
      <p><strong>작성자:</strong> {recipe.RGTR_NM} ({recipe.RGTR_ID})</p>
      <p><strong>조회수:</strong> {recipe.INQ_CNT}</p>
      <p><strong>추천 수:</strong> {recipe.RCMM_CNT}</p>
      <p><strong>스크랩 수:</strong> {recipe.SRAP_CNT}</p>
      
      <h2>요리 정보</h2>
      <p><strong>요리 방법:</strong> {recipe.CKG_MTH_ACTO_NM}</p>
      <p><strong>요리 스타일:</strong> {recipe.CKG_STA_ACTO_NM}</p>
      <p><strong>재료 종류:</strong> {recipe.CKG_MTRL_ACTO_NM}</p>
      <p><strong>요리 종류:</strong> {recipe.CKG_KND_ACTO_NM}</p>
      <p><strong>요리 소개:</strong> {recipe.CKG_IPDC}</p>

      <h2>재료</h2>
      <p>{recipe.CKG_MTRL_CN}</p>
      
      <h2>세부 정보</h2>
      <p><strong>인분:</strong> {recipe.CKG_INBUN_NM}</p>
      <p><strong>난이도:</strong> {recipe.CKG_DODF_NM}</p>
      <p><strong>조리 시간:</strong> {recipe.CKG_TIME_NM}</p>
      <p><strong>최초 등록일:</strong> {recipe.FIRST_REG_DT}</p>
    </div>
  );
};

export default RecipeDetailPage;
