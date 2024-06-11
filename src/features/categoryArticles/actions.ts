import { GetThunkAPI, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategoryIArticlesAPI } from '@app/API';

export const fetchCategoryArticles = createAsyncThunk(
  'api/fetchCategoryArticles',
  (category: string, thunkAPI: GetThunkAPI<any>) =>
    fetchCategoryIArticlesAPI(category, thunkAPI)
);
