class User {
  constructor(data) {
    userData = JSON.parse(data);
    this.id = userData.id;
    this.username = userData.username;
    this.password = userData.password;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.email = userData.email;
    this.address = userData.address;
    this.lastName = userData.lastName;
    this.role = userData.role;
    this.phone = userData.phone;
  }
  userInfo() {
    let data = {
      id: id,
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: address,
      lastName: lastName,
      role: role,
      phone: phone,
    };
    return data;
  }
}

module.exports = User;
