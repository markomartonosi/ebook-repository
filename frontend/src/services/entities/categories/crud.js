import axiosWrapper from '../../shared/axios-wrapper';
import { backboneApiBaseUrl } from '../../shared/constants';

const CATEGORIES_ENDPOINT = backboneApiBaseUrl + "/categories/"

function getAllCategories() {
    return axiosWrapper.get(CATEGORIES_ENDPOINT).then(resp => {
        return { "categories": resp.data.data };
    });
}

function updateCategory(id, name) {
    if (name.trim() === "") {
        alert("Name must not be empty value!");
        return;
    }

    const data = {
        "data": {
            "id": id,
            "type": "Category",
            "attributes": {
                "name": name
            }
        }
    }

    return axiosWrapper.put(CATEGORIES_ENDPOINT + id + "/", data, {
        headers: {
            "Content-Type": "application/vnd.api+json"
        }
    }).then(resp => {
        if (resp.status === 200) {
            return true;
        }
    });
}


function createCategory(name) {
    if(name.trim() === "") {
        alert("Name must not be empty value!");
        return;
    }

    const data = {
        "data": {
            "type": "Category",
            "attributes": {
                "name": name
            }
        }
    }

    return axiosWrapper.post(CATEGORIES_ENDPOINT, data, {
        headers: {
            "Content-Type": "application/vnd.api+json"
        }
    }).then(resp => {
        if(resp.status === 201) return {"success": true, "extra": resp.data.data};
        return {"success": false};
    }).catch(err => {
        return {"success": false}
    });
}



function deleteCategory(id) {
    return axiosWrapper.delete(CATEGORIES_ENDPOINT + id + "/").then(resp => {
        if(resp.status === 204) 
            return true;
        return false;
    }).catch(err => false);
}


export {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}