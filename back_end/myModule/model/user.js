class User {
  constructor(userData) {
    this.userID = userData.UserID;
    this.userName = userData.UserName;
    this.password = userData.Password;
    this.firstName = userData.FirstName;
    this.lastName = userData.LastName;
    this.email = userData.Email;
    this.address = userData.Address;
    this.role = userData.Role;
    this.phone = userData.Phone;
  }
  userInfo() {
    let data = {
      userID: this.userID,
      userName: this.userName,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      address: this.address,
      role: this.role,
      phone: this.phone,
    };
    return data;
  }
}

module.exports = User;
