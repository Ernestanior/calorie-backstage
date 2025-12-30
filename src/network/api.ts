import request from ".";

export function foodPage(data: any) {
  return request({
    method: 'post',
    url: '/foodNutrition/page',
    data
  });
}

export function foodCreate(data: any) {
  return request({
    method: 'put',
    url: '/foodNutrition/create',
    data
  });
}

export function foodDelete(params: any) {
  return request({
    method: 'delete',
    url: '/foodNutrition/delete',
    params
  });
}


export function foodModify(data: any) {
  return request({
    method: 'put',
    url: '/foodNutrition/modify',
    data
  });
}


export function recipeSetPage(data: any) {
  return request({
    method: 'post',
    url: '/recipeSet/page',
    data
  });
}

export function recipeSetCreate(data: any) {
  return request({
    method: 'put',
    url: '/recipeSet/create',
    data
  });
}

export function recipeSetDelete(params: any) {
  return request({
    method: 'delete',
    url: '/recipeSet/delete',
    params
  });
}


export function recipeSetModify(data: any) {
  return request({
    method: 'put',
    url: '/recipeSet/modify',
    data
  });
}


export function recipePage(data: any) {
  return request({
    method: 'post',
    url: '/recipe/page',
    data
  });
}

export function recipeCreate(data: any) {
  return request({
    method: 'put',
    url: '/recipe/create',
    data
  });
}

export function recipeDelete(params: any) {
  return request({
    method: 'delete',
    url: '/recipe/delete',
    params
  });
}


export function recipeModify(data: any) {
  return request({
    method: 'put',
    url: '/recipe/modify',
    data
  });
}

export function recipeRefreshCover(data: any) {
  return request({
    method: 'put',
    url: '/recipe/refresh/cover',
    data
  });
}

export function fileUpload(data: any) {
  return request({
    method: 'put',
    url: '/file/upload',
    type: 'formData',
    data
  });
}

export function imgGenerate(params: any) {
  return request({
    method: 'put',
    url: '/image/generate',
    params,
  });
}

// 新版：餐食菜品明细（基于 t_recipe_meal_item_view）
export function recipeMealItemPage(data: any) {
  return request({
    method: 'post',
    url: '/recipe/meal/item/page',
    data,
  });
}

export function recipeMealItemCreate(data: any) {
  return request({
    method: 'put',
    url: '/recipe/meal/item/create',
    data,
  });
}

export function recipeMealItemModify(data: any) {
  return request({
    method: 'put',
    url: '/recipe/meal/item/modify',
    data,
  });
}

export function recipeMealItemDelete(params: any) {
  return request({
    method: 'delete',
    url: '/recipe/meal/item/delete',
    params,
  });
}


export function userList(data: any) {
  return request({
    method: 'post',
    url: '/user/list',
    data
  });
}

export function userDelete(id: number) {
  return request({
    method: 'delete',
    url: '/user/delete',
    params:{id}
  });
}

export function userModify(data: any) {
  return request({
    method: 'put',
    url: '/user/modify',
    data
  });
}


export function yifanRecipeResponsePage(data: any) {
  return request({
    method: 'post',
    url: '/yifan/recipe/response/page',
    data
  });
}
