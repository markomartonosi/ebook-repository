function mergeIncludedWithData(data, included) {
    data.forEach(item => {
        item.relationships.user = included.filter(obj => obj.type === "User" && obj.id === item.relationships.user.data.id)[0];
        item.relationships.category = included.filter(obj => obj.type === "Category" && obj.id === item.relationships.category.data.id)[0];
        item.relationships.language = included.filter(obj => obj.type === "Language" && obj.id === item.relationships.language.data.id)[0];
    });
    console.log(data);
    return data;
}


function fromEntitiesToSelectOptions(entityList) {
    //Returns modified array of languages/categories to match UesSelect options structure
    
    return entityList.map(item => {
        // TODO: fix this hotfix
        let name = "";
        if(item.attributes === undefined) {
            name = item.name;
        } else{
            name = item.attributes.name;
        }
        return { "id": item.id, "value": name }
    });
}

function getCategoryByName(name, categories) {
    return categories.filter(category => {
        return category.attributes.name === name;
    })[0];
}

function mapCategoriesArrayToCategoriesJsonAPI(categoryIds) {
    return categoryIds.map(categoryId => {
        return ({ "type": "Category", "id": categoryId });
    });
}


export {
    mergeIncludedWithData,
    fromEntitiesToSelectOptions,
    getCategoryByName,
    mapCategoriesArrayToCategoriesJsonAPI
}