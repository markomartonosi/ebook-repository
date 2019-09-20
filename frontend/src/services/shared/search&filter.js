import axiosWrapper from '../shared/axios-wrapper';
import { searchApiBaseUrl, backboneApiBaseUrl } from './constants';

function processQueryAndFiltersFromUrl(queryUrl, filtersUrl) {
  return axiosWrapper.get(backboneApiBaseUrl + "/filters").then(resp => {
    let data = resp.data.data;
    return {
      "filterAutocomplete": data.author.filter((v, i) => data.author.indexOf(v) === i),
      "author": data.author.filter((v, i) => data.author.indexOf(v) === i),
      "publication_year": data.publication_year.filter((v, i) => data.publication_year.indexOf(v) === i),
      "language": data.language.filter((v, i) => data.language.indexOf(v) === i),
      "category": data.category.filter((v, i) => data.category.indexOf(v) === i),
      "appliedFilters": filtersUrl ? filtersUrl.split("&") : "", 
      "appliedQuery": queryUrl || ""
    };
  });
}



function search(query, filters) {
  const data = {
    "query": query,
    "filters": separateFilters(filters)
  }

  return axiosWrapper.post(searchApiBaseUrl + "/search", data).then(resp => {
    if (resp.data.hits.total.value != 0) {
      return {"ebooks": resp.data.hits.hits, "query": query, "filters":filters}; 
    }
  })
}

function separateFilters(filters) {
  let data = {
    "author": [],
    "publication_year": [],
    "category": [],
    "language": []
  };

  if (filters.trim() === "") {
    return data;
  }

  let groupedFilters = filters.split("&");
  if (groupedFilters.length < 1) {
    return;
  }

  groupedFilters.forEach(singleFilter => {
    const singleFilterValue = singleFilter.split("=")[1];
    const singleFilterType = singleFilter.split("=")[0];

    let existingFilterValues = data[singleFilterType];
    existingFilterValues.push(singleFilterValue);
    data[singleFilterType] = existingFilterValues;
  });

  return data;
}

export {
  search,
  processQueryAndFiltersFromUrl
}