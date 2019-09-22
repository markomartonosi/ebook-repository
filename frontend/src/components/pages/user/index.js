import React, { Component } from 'react';
import { isAuthorized, isAdmin, removeTokens, getDecodedAccessToken } from '../../../services/shared/auth';
import { getUserById, patchUserInfo, patchUserPassword, deleteUser } from '../../../services/entities/users/crud';
import Account from '../../templates/account';
import UesSelect from '../../atoms/select';
import { updatePasswordValidation } from '../../../services/entities/users/util';


class UserPage extends Component {
  constructor() {
    super();
    this.state = {}
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  handleInputChange(e) {
    this.setState({ [e.target.attributes.typename.value]: e.target.value });
  }

  // FIXME: alter?
  onSelectChange(e) {
    this.setState({ "selectedCategories": Array.from(e.target.selectedOptions, (item) => ({ "id": item.id, "value": item.value })) });
  }


  componentDidMount() {
    const idParam = this.props.match.params.id;
    if (isAuthorized(idParam)) {
      getUserById(idParam).then(resp => this.setState(resp))
    }
  }

  handleSubmit(e) {
    patchUserInfo(this.state.user.id, this.state.firstName, this.state.lastName, this.state.username, this.state.type, this.state.selectedCategories.map(item => item.id))
      .then(patchSuccessfull => {
        if (patchSuccessfull) {
          if(parseInt(this.state.id) === getDecodedAccessToken().user_id) {
            removeTokens();
            window.location.replace("/login");
          }
          window.location.replace("/");
        } else {
          alert("Patch unsucessful");
        }
      })
  }

  //TODO: PROCEES 'YEY'
  handlePasswordChange(e) {

    console.log("handling password chnge", this.state);

    const data = {
      "id": this.state.id,
      "oldPassword": this.state.oldPassword || "",
      "newPassword": this.state.newPassword || "",
      "newPasswordConfirm": this.state.repeatNewPassword || ""
    };

    if (!updatePasswordValidation(data)) return;
    patchUserPassword(data)
      .then(patchSuccessfull => {
        if (patchSuccessfull) {
          if(parseInt(this.state.id) == parseInt(getDecodedAccessToken().user_id)) {
            removeTokens();
            window.location.replace("/login");
          } else {
            window.location.replace("/admin");
          }
          
        } else {
          alert("Old password is incorrect!");
        }
      })
  }


  handleDelete(e) {
    deleteUser(this.state.id).then(deleteSuccessful => {
      if (deleteSuccessful) {
        if(this.state.id === getDecodedAccessToken().user_id) {
          window.location.replace("/");
        } else {
          // if user isn't deleting itself, admin is deleting him
          window.location.replace("/admin"); // TODO: change this
        }
      }
    })
  }


  handleTypeChange(e) {
    this.setState({ "type": e.target.value });
  }

  render() {
    const categories = this.state.categories || [];
    const userTypes = [{ "id": 1, "value": "administrator" }, { "id": 2, "value": "subscriber" }];
    console.log(this.state);
    return (
      this.state.authorized ?
        <>
          <Account /><br />

          <h2>User info</h2>
          firstname: <input placeholder="firstname" typename="firstName" onChange={this.handleInputChange} value={this.state.firstName}></input><br />
          lastname: <input placeholder="lastname" typename="lastName" onChange={this.handleInputChange} value={this.state.lastName}></input><br />
          username: <input placeholder="username" typename="username" onChange={this.handleInputChange} value={this.state.username}></input><br />
          {/* TODO: ues multiple select */}
          categories: <select name="categories" multiple onChange={this.onSelectChange} value={this.state.selectedCategories.map(item => item.value)}>
            {categories.map(category =>
              <option id={category.id} key={category.id} value={category.attributes.name}>{category.attributes.name}</option>
            )}
          </select><br />
          {/* TODO: SELECT FOR USER TYPE */}
          {isAdmin() ? <> type: </> : <></>} <UesSelect selected={this.state.type} change={this.handleTypeChange} options={userTypes} guards={[isAdmin,]} />
          <button onClick={this.handleSubmit}>Update</button>
          <h2>Change password</h2>
          <input placeholder="old password" typename="oldPassword" onChange={this.handleInputChange} value={this.state.oldPassword || ""} type="password"></input><br />
          <input placeholder="new password" typename="newPassword" onChange={this.handleInputChange} value={this.state.newPassword || ""} type="password"></input><br />
          <input placeholder="repeat new password" typename="repeatNewPassword" onChange={this.handleInputChange} value={this.state.repeatNewPassword || ""} type="password"></input><br />
          <button onClick={this.handlePasswordChange}>Change</button><br />
          <button onClick={this.handleDelete}>Delete account</button>
        </>
        :
        <> Forbidden </>
    );
  }
}
export default UserPage;