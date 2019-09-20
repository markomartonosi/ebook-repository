import { backboneApiBaseUrl } from '../../shared/constants';
import axiosWrapper from '../../shared/axios-wrapper';
import { mapCategoriesArrayToCategoriesJsonAPI } from '../../shared/util';
import { isAdmin, removeTokens, getDecodedAccessToken } from '../../shared/auth'


function getAllUsers() {
    return axiosWrapper.get(backboneApiBaseUrl + "/users/")
        .then(resp => {
            return {"users": resp.data.data};
        })
}
 
function register(firstname, lastname, username, password) {
    const user = {
        "data": {
            "type": "User",
            "attributes": {
                "first_name": firstname,
                "last_name": lastname,
                "username": username,
                "password": password,
                "type": "subscriber",
                "categories": []
            }
        }
    };
    return axiosWrapper.post(backboneApiBaseUrl + "/users/", user, {
        headers: {
            "Content-Type": "application/vnd.api+json"
        }
    }).then(resp => {
        if (resp.status === 201) {
            return true;
        }

        return false;
    });
}

function getUserById(id) {
    let retVal = {}
    return axiosWrapper.get(backboneApiBaseUrl + "/users/" + id + "/?include=categories").then(resp => {
        const categories = resp.data.included || [];
        retVal["id"] = resp.data.data.id;
        retVal["authorized"] = true;
        retVal["user"] = resp.data.data;
        retVal["firstName"] = resp.data.data.attributes.first_name;
        retVal["lastName"] = resp.data.data.attributes.last_name;
        retVal["username"] = resp.data.data.attributes.username;
        retVal["type"] = resp.data.data.attributes.type;
        retVal["selectedCategories"] = Array.from(categories, (item) => ({ "id": item.id, "value": item.attributes.name }) || []);
        return axiosWrapper.get(backboneApiBaseUrl + "/categories");
    }).then(resp => {
        retVal["categories"] = resp.data.data;
        return retVal;
    });
}

function patchUserInfo(id, firstName, lastName, username, type, categories) {
    if (firstName.trim() === "" || lastName.trim() === "" || username.trim() === "") {
        alert("Firstname, lastname and username fields are mandatory!");
        return;
    }

    if(type === undefined) type = "subscriber";


    const user = {
        "data": {
            "type": "User",
            "id": id,
            "attributes": {
                "first_name": firstName,
                "last_name": lastName,
                "username": username,
                "type": type
            },
            "relationships": {
                "categories": {
                    "data": mapCategoriesArrayToCategoriesJsonAPI(categories)
                }
            }
        }
    }


    console.log(user);

    return axiosWrapper.patch(backboneApiBaseUrl + "/users/" + parseInt(id) + "/", user, {
        headers: {
            "Content-Type": "application/vnd.api+json"
        }
    })
        .then(resp => {
            if (resp.status === 200) {
                if(id === getDecodedAccessToken().id) {
                    removeTokens();//TODO: CHECK IF NECESSARY
                }
                return true;
            }
        });
}

function patchUserPassword(userData) {
    const user = {
        "data": {
            "type": "User",
            "id": userData["id"],
            "attributes": {
                "old_password": userData["oldPassword"],
                "new_password": userData["newPassword"],
            },
        }
    }

    return axiosWrapper.patch(backboneApiBaseUrl + "/users/change-password/", user, {
        headers: {
            "Content-Type": "application/vnd.api+json"
        }
    })
        .then(resp => {
            if (resp.status === 200) {
                if(userData["id"] == getDecodedAccessToken().id) {
                    removeTokens(); //TODO: CHECK IF NECESSARY
                }
                return true;
            }
            return false;
        }).catch(err => {
            return false;
        });
}


function deleteUser(id) {
    return axiosWrapper.delete(backboneApiBaseUrl + "/users/" + parseInt(id) + "/").then(resp => {
        if(resp.status === 204) {
            if(id === getDecodedAccessToken().id) {
                removeTokens();
            }
            return true;
        }
        return false;
    })
}


export {
    register,
    getAllUsers,
    getUserById,
    patchUserInfo,
    patchUserPassword,
    deleteUser
}