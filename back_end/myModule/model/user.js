class User {
  constructor(userData) {
    this.id = userData.UserID;
    this.username = userData.UserName;
    this.password = userData.Password;
    this.firstName = userData.FirstName;
    this.lastName = userData.LastName;
    this.email = userData.Email;
    this.address = userData.Address;
    this.lastName = userData.LastName;
    this.role = userData.Role;
    this.phone = userData.Phone;
  }
  userInfo() {
    let data = {
      id: this.id,
      username: this.username,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      address: this.address,
      lastName: this.lastName,
      role: this.role,
      phone: this.phone,
    };
    return data;
  }
}

module.exports = User;
